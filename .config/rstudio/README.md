# RStudio config

- rstudio-prefs.json	User preferences
- dictionaries/	Custom spelling dictionaries
- keybindings/	Editor and workbench keybindings, in JSON format
- snippets/	Console and source snippets (*.snippet)
- templates/	Default content for new files
- themes/	Custom color themes (*.rstheme)

## user prefs
User preferences established in the RStudio IDE's Global Options dialog can also be set in the JSON file `rstudio-prefs.json`, which is placed in settings directory.

### schema 

The schema for the JSON file can be found at:

```
/usr/lib/rstudio-server/resources/schema/user-prefs-schema.json
```
It lists all settings, displays data types and permissible values, and briefly explains how to use them.

### example

Users that have several sessions open are only shown the server home page (session overview) by default. Set it in the global user preferences file as follows to show it to all users regardless of the number of current sessions:

_/etc/rstudio/rstudio-prefs.json_


```
{
    "show_user_home_page": "always"
}


## snippets

You can install global snippets files for all users in the /etc/rstudio/snippets folder. For example, if you’d like to create a snippet lib for an R library call:


_/etc/rstudio/snippets/r.snippets_

```
snippet lib
    library(${1:package})
```

In the file css.snippets, you may also specify snippets for CSS files, and so on. The snippet file format is documented in the [Cloud 9 IDE snippet](https://cloud9-sdk.readme.io/docs/snippets) documentation.

It should be noted that RStudio Server will not combine snippet files, implying the following:

- If you create your own snippets (for a certain file type), they will take the place of those that come with RStudio (for that same file type).
- Users who specify their own snippets (for a specific file type) are unaffected by modifications to the system snippet file (for that same file type).

##  Default Document Templates



RStudio frequently creates new documents with no content. However, you may specify the contents of the blank document by creating a file called default. X in /etc/rstudio/templates, where X is the file extension that you want to change. For example, you could use the following to begin all R scripts with a standard comment header that users may fill out:

_/etc/rstudio/templates/default.R_


```
# -------------------------------------
# Script: 
# Author: 
# Purpose: 
# Notes:
#   
# Copyright(c) Corporation Name
# -------------------------------------
```

There are also several R Markdown document template files included with RStudio that may be customized. You can change the following in `/etc/rstudio/templates`:

- `document.Rmd` : The default R Markdown document file content (without YAML header)
- `notebook.Rmd`: The default R Notebook file content (without YAML header)
- `presentation.Rmd`	: The default R Markdown presentation file content (without YAML header)
- `shiny.Rmd`: 	The default Shiny R Markdown file content (without YAML header)

## color themes

Additional custom themes for RStudio may be defined by placing.rstheme files in the following directory _/etc/rstudio/themes_.
The `.rstheme` file provides plain-text CSS along with some other metadata. You may either import an existing TextMate theme file or start from scratch (using an existing theme file as a template). Execute the R command? For further information, see `rstudioapi::addTheme.

## Keybindings

RStudio keybindings can be globally defined using the following two files:

_/etc/rstudio/keybindings/editor_commands.json_

_/etc/rstudio/keybindings/rstudio_commands.json_

It is not required to manually create these files; RStudio can do it for you:

- Delete the folder `/.config/rstudio/keybindings/¡.
- Begin a new R session and adjust the keyboard shortcuts as required.
- To make the `new.json` files active for all users on the server, copy them from `/.config/rstudio/keybindings to /etc/rstudio/keybindings`.


## spelling

Additional spelling dictionaries for RStudio can be defined by putting dictionary files in the following folders:

### Languages

Define additional system languages by placing Hunspell `.aff` files in:

_/etc/rstudio/dictionaries/languages-system_

### Dictionaries

Define additional custom dictionaries by placing Hunspell `.dic` files in:

_/etc/rstudio/dictionaries/custom_



