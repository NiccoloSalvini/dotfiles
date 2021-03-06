"use strict";
// From https://github.com/DSpeckhals/python-indent-parser
// MIT Licensed
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldHang = exports.indentationInfo = exports.nextIndentationLevel = exports.indentationLevel = exports.Hanging = void 0;
var Hanging;
(function (Hanging) {
    Hanging[Hanging["None"] = 0] = "None";
    Hanging[Hanging["Partial"] = 1] = "Partial";
    Hanging[Hanging["Full"] = 2] = "Full";
})(Hanging = exports.Hanging || (exports.Hanging = {}));
function indentationLevel(line) {
    return line.search(/\S|$/);
}
exports.indentationLevel = indentationLevel;
function nextIndentationLevel(parseOutput, lines, tabSize) {
    const row = lines.length - 1;
    // openBracketStack: A stack of [row, col] pairs describing where open brackets are
    // lastClosedRow: Either empty, or an array [rowOpen, rowClose] describing the rows
    //     where the last bracket to be closed was opened and closed.
    // lastColonRow: The last row a def/for/if/elif/else/try/except etc. block started
    // dedentNext: Boolean, should we dedent the next row?
    const { openBracketStack, lastClosedRow, lastColonRow, dedentNext, } = parseOutput;
    if (dedentNext && !openBracketStack.length) {
        return indentationLevel(lines[row]) - tabSize;
    }
    if (!openBracketStack.length) {
        // Can assume lastClosedRow is not empty
        if (lastClosedRow[1] === row) {
            // We just closed a bracket on the row, get indentation from the
            // row where it was opened
            let indentLevel = indentationLevel(lines[lastClosedRow[0]]);
            if (lastColonRow === row) {
                // We just finished def/for/if/elif/else/try/except etc. block,
                // need to increase indent level by 1.
                indentLevel += tabSize;
            }
            return indentLevel;
        }
        if (lastColonRow === row) {
            return indentationLevel(lines[row]) + tabSize;
        }
        return indentationLevel(lines[row]);
    }
    if (lastColonRow === row) {
        return indentationLevel(lines[row]) + tabSize;
    }
    // At this point, we are guaranteed openBracketStack is non-empty,
    // which means that we are currently in the middle of an opened/closed
    // bracket.
    const lastOpenBracketLocation = openBracketStack[openBracketStack.length - 1];
    // Get some booleans to help work through the cases
    // haveClosedBracket is true if we have ever closed a bracket
    const haveClosedBracket = lastClosedRow.length > 0;
    // justOpenedBracket is true if we opened a bracket on the row we just finished
    const justOpenedBracket = lastOpenBracketLocation[0] === row;
    // justClosedBracket is true if we closed a bracket on the row we just finished
    const justClosedBracket = haveClosedBracket && lastClosedRow[1] === row;
    // closedBracketOpenedAfterLineWithCurrentOpen is an ***extremely*** long name, and
    // it is true if the most recently closed bracket pair was opened on
    // a line AFTER the line where the current open bracket
    const closedBracketOpenedAfterLineWithCurrentOpen = haveClosedBracket
        && lastClosedRow[0] > lastOpenBracketLocation[0];
    let indentColumn;
    if (!justOpenedBracket && !justClosedBracket) {
        // The bracket was opened before the previous line,
        // and we did not close a bracket on the previous line.
        // Thus, nothing has happened that could have changed the
        // indentation level since the previous line, so
        // we should use whatever indent we are given.
        return indentationLevel(lines[row]);
    }
    else if (justClosedBracket && closedBracketOpenedAfterLineWithCurrentOpen) {
        // A bracket that was opened after the most recent open
        // bracket was closed on the line we just finished typing.
        // We should use whatever indent was used on the row
        // where we opened the bracket we just closed. This needs
        // to be handled as a separate case from the last case below
        // in case the current bracket is using a hanging indent.
        // This handles cases such as
        // x = [0, 1, 2,
        //      [3, 4, 5,
        //       6, 7, 8],
        //      9, 10, 11]
        // which would be correctly handled by the case below, but it also correctly handles
        // x = [
        //     0, 1, 2, [3, 4, 5,
        //               6, 7, 8],
        //     9, 10, 11
        // ]
        // which the last case below would incorrectly indent an extra space
        // before the "9", because it would try to match it up with the
        // open bracket instead of using the hanging indent.
        indentColumn = indentationLevel(lines[lastClosedRow[0]]);
    }
    else {
        // lastOpenBracketLocation[1] is the column where the bracket was,
        // so need to bump up the indentation by one
        indentColumn = lastOpenBracketLocation[1] + 1;
    }
    return indentColumn;
}
exports.nextIndentationLevel = nextIndentationLevel;
function parseLines(lines) {
    // openBracketStack is an array of [row, col] indicating the location
    // of the opening bracket (square, curly, or parentheses)
    const openBracketStack = [];
    // lastClosedRow is either empty or [rowOpen, rowClose] describing the
    // rows where the latest closed bracket was opened and closed.
    let lastClosedRow = [];
    // If we are in a string, this tells us what character introduced the string
    // i.e., did this string start with ' or with "?
    let currentStringDelimiter = null;
    // This is the row of the last function definition
    let lastColonRow = NaN;
    // true if we are in a triple quoted string
    let inTripleQuotedString = false;
    // If we have seen two of the same string delimiters in a row,
    // then we have to check the next character to see if it matches
    // in order to correctly parse triple quoted strings.
    let checkNextCharForString = false;
    // true if we should dedent the next row, false otherwise
    let dedentNext = false;
    // true if we should have a hanging indent, false otherwise
    let canHang = false;
    // if we see these words at the beginning of a line, dedent the next one
    const dedentNextKeywords = [/^\s*return\b/, /^\s*pass\b/, /^\s*break\b/, /^\s*continue\b/, /^\s*raise\b/];
    // If we're in a single-quoted string, on what column did the string start?
    let stringStartColumn = null;
    // If we're in a single-quoted string, what's its prefix, e.g. r"asdf"
    let stringPrefix = null;
    // NOTE: this parsing will only be correct if the python code is well-formed
    // statements like "[0, (1, 2])" might break the parsing
    // loop over each line
    const linesLength = lines.length;
    for (let row = 0; row < linesLength; row += 1) {
        const line = lines[row];
        dedentNext = (currentStringDelimiter === null) && dedentNextKeywords.some((word) => line.search(word) >= 0);
        // Keep track of the number of consecutive string delimiter's we've seen
        // in this line; this is used to tell if we are in a triple quoted string
        let numConsecutiveStringDelimiters = 0;
        // boolean, whether or not the current character is being escaped
        // applicable when we are currently in a string
        let isEscaped = false;
        // If we're in a single-quoted string, on what column did the string start?
        stringStartColumn = null;
        // If we're in a single-quoted string, what's its prefix, e.g. r"asdf"
        stringPrefix = null;
        // This is the last defined def/for/if/elif/else/try/except row
        const lastlastColonRow = lastColonRow;
        const lineLength = line.length;
        for (let col = 0; col < lineLength; col += 1) {
            const c = line[col];
            if (c === currentStringDelimiter && !isEscaped) {
                numConsecutiveStringDelimiters += 1;
            }
            else if (checkNextCharForString) {
                numConsecutiveStringDelimiters = 0;
                currentStringDelimiter = null;
            }
            else {
                numConsecutiveStringDelimiters = 0;
            }
            checkNextCharForString = false;
            // If stringDelimiter is set, then we are in a string
            // Note that this works correctly even for triple quoted strings
            if (currentStringDelimiter) {
                if (isEscaped) {
                    // If current character is escaped, then we do not care what it was,
                    // but since it is impossible for the next character to be escaped as well,
                    // go ahead and set that to false
                    isEscaped = false;
                }
                else if (c === currentStringDelimiter) {
                    // We are seeing the same quote that started the string, i.e. ' or "
                    if (inTripleQuotedString) {
                        if (numConsecutiveStringDelimiters === 3) {
                            // Breaking out of the triple quoted string...
                            numConsecutiveStringDelimiters = 0;
                            currentStringDelimiter = null;
                            inTripleQuotedString = false;
                        }
                    }
                    else if (numConsecutiveStringDelimiters === 3) {
                        // reset the count, correctly handles cases like ''''''
                        numConsecutiveStringDelimiters = 0;
                        inTripleQuotedString = true;
                    }
                    else if (numConsecutiveStringDelimiters === 2) {
                        // We are not currently in a triple quoted string, and we've
                        // seen two of the same string delimiter in a row. This could
                        // either be an empty string, i.e. '' or "", or it could be
                        // the start of a triple quoted string. We will check the next
                        // character, and if it matches then we know we're in a triple
                        // quoted string, and if it does not match we know we're not
                        // in a string any more (i.e. it was the empty string).
                        checkNextCharForString = true;
                    }
                    else if (numConsecutiveStringDelimiters === 1) {
                        // We are not in a string that is not triple quoted, and we've
                        // just seen an un-escaped instance of that string delimiter.
                        // In other words, we've left the string.
                        // It is also worth noting that it is impossible for
                        // numConsecutiveStringDelimiters to be 0 at this point, so
                        // this set of if/else if statements covers all cases.
                        currentStringDelimiter = null;
                    }
                }
                else if (c === "\\") {
                    // We are seeing an unescaped backslash, the next character is escaped.
                    // Note that this is not exactly true in raw strings, HOWEVER, in raw
                    // strings you can still escape the quote mark by using a backslash.
                    // Since that's all we really care about as far as escaped characters
                    // go, we can assume we are now escaping the next character.
                    isEscaped = true;
                }
            }
            else if ("[({".includes(c)) {
                // If the only characters after this opening bracket are whitespace,
                // then we should do a hanging indent. If there are other non-whitespace
                // characters after this, then they will set the canHang boolean to false
                canHang = true;
                openBracketStack.push([row, col]);
            }
            else if (" \t\r\n".includes(c)) { // just in case there's a new line
                // If it's whitespace, we don't care at all
            }
            else if (c === "#") {
                break; // skip the rest of this line.
            }
            else {
                // We've already skipped if the character was white-space, an opening
                // bracket, or a comment, so that means the current character is not
                // whitespace and not an opening bracket, so canHang needs to get set to
                // false.
                canHang = false;
                // Similar to above, we've already skipped all irrelevant characters,
                // so if we saw a colon earlier in this line, then we would have
                // incorrectly thought it was the end of a def/for/if/elif/else/try/except
                // block when it was actually a dictionary being defined/type hinting,
                // reset the lastColonRow variable to whatever it was when we started
                // parsing this line.
                lastColonRow = lastlastColonRow;
                if (c === ":") {
                    lastColonRow = row;
                }
                else if ("})]".includes(c) && openBracketStack.length) {
                    const openedRow = openBracketStack.pop()[0];
                    // lastClosedRow is used to set the indentation back to what it was
                    // on the line when the corresponding bracket was opened. However,
                    // if the bracket was opened on this same line, then we do not need
                    // or want to do that, and in fact, it can obscure other earlier
                    // bracket pairs. E.g.:
                    //   def f(api):
                    //       (api
                    //        .doSomething()
                    //        .anotherThing()
                    //        ).finish()
                    //       print('Correctly indented!')
                    // without the following check, the print statement would be indented
                    // 5 spaces instead of 4.
                    if (row !== openedRow) {
                        lastClosedRow = [openedRow, row];
                    }
                }
                else if ("'\"".includes(c)) {
                    // Starting a string, keep track of what quote was used to start it.
                    currentStringDelimiter = c;
                    numConsecutiveStringDelimiters += 1;
                    stringStartColumn = col;
                    if (col > 0) {
                        if ("rufb".includes(line[col - 1])) {
                            stringPrefix = line[col - 1];
                            if (col > 1) {
                                if ("rufb".includes(line[col - 2])) {
                                    stringPrefix = line.slice(col - 2, col);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return {
        canHang, dedentNext, lastClosedRow, lastColonRow, openBracketStack,
        currentStringDelimiter, stringStartColumn, stringPrefix
    };
}
function indentationInfo(lines, tabSize) {
    const parseOutput = parseLines(lines);
    const nextIndent = nextIndentationLevel(parseOutput, lines, tabSize);
    return { nextIndentationLevel: nextIndent, parseOutput };
}
exports.indentationInfo = indentationInfo;
// Determines if a hanging indent should happen, and if so how much of one
function shouldHang(line, char) {
    if (char <= 0 || line.length === 0) {
        return Hanging.None;
    }
    // Line continuation using backslash
    if (line[char - 1] === "\\") {
        return Hanging.Partial;
    }
    if (!"[({".includes(line[char - 1])) {
        return Hanging.None;
    }
    // These characters don't have an effect one way or another.
    const neutralChars = ": \t\r".split("");
    // The presence of these characters mean that we're in Full mode.
    const fullChars = "]})".split("");
    const theRest = new Set(line.slice(char).split(""));
    // We only return Hanging.Full if the rest of the characters
    // are neutralChars/fullChars, *and* if at least one of the fullChars
    // is in theRest
    neutralChars.forEach((c) => theRest.delete(c));
    const containsSomeChars = theRest.size > 0;
    fullChars.forEach((c) => theRest.delete(c));
    const containsOnlyFullChars = theRest.size === 0;
    if (containsSomeChars && containsOnlyFullChars) {
        return Hanging.Full;
    }
    return Hanging.Partial;
}
exports.shouldHang = shouldHang;
//# sourceMappingURL=parser.js.map