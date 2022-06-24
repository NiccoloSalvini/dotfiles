#!/usr/bin/env bash
set -e
[ -n "$PYENV_DEBUG" ] && set -x

program="${0##*/}"

export PYENV_ROOT="/Users/niccolo/.pyenv"
exec "/opt/homebrew/opt/pyenv/bin/pyenv" exec "$program" "$@"
