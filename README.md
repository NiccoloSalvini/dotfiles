# dotfiles

Dotfile Configurations 

Currently using zsh as main editor/terminal combo and using the [Starship prompt](https://starship.rs/).

## Context

The configurations in this repository are unlikely to be suitable for every developer. 

I don't recommend you blindly install/overwrite your current configurations with this files. Instead, read the config files and take the bits you like, line by line.

I am a ML Engineer primarily working with Python and using cloud providers such as GCP and AWS. These dotfiles reflect my daily Python workflow working in zsh from the command line.

I use `pyenv` for Python version and virtual environment management + [pipx](https://github.com/pypa/pipx) + [Poetry](https://python-poetry.org/) to manage library and project level dependecies according to [this guide](https://pythonbiellagroup.it/it/gestire-dipendenze/poetry-advance/) 

## Oh-my-ZSH

- [Starship (prompt)](https://starship.rs/) - Minimal cross-shell prompt (see starship.toml for config)
- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)
- [zsh-autocomplete](https://github.com/marlonrichert/zsh-autocomplete)
- [Nerd fonts](https://github.com/ryanoasis/nerd-fonts) - Powerline-patched fonts. I use Hack.
- [Exa](https://the.exa.website/) - `ls` replacement

---

## How to Use (MacOS)

### Clone Repo

```
git clone https://github.com/NiccoloSalvini/dotfiles.git
```

### Install Homebrew

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Install command line programs in the Brewfile**

> Caution: don't blindy install everything. Better approach to use a more minimal brewfile

**Note: The Brewfile does not support version lock syntax and will download the latest version of each package.**

```
brew bundle
```

### Install zsh

Install `zsh`, install plugins and set as primary shell using the following script:

```
bash install_zsh.sh
```

Note: make sure you 'source' each dotfile to make sure changes have been made

## Limitations

Automation and configurations mainly aimed at MacOS. Need to test and debug for linux distros.

Brewfile contains the kitchen sink -- might make a more 'minimal' version in the future. Don't blindly install everything as it is probably not all needed

## Resources

These dotfile configuration have been heavily inspired by the following resources. I highly recommend you check them out:
- [Devsalife dotfiles + YouTube channel](https://github.com/craftzdog/dotfiles-public)
- [Chris Toomey - Tmux Course](https://thoughtbot.com/upcase/tmux)
