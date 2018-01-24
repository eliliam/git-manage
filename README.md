# git-manage
[![Build Status](https://travis-ci.org/eliliam/git-manage.svg?branch=master)](https://travis-ci.org/eliliam/git-manage)
[![npm version](https://badge.fury.io/js/git-manage.svg)](https://badge.fury.io/js/git-manage)
A cli tool to manage syncing of all local git repositories to their
remotes

# Installation
`npm install git-manage`

# Usage
|Command     |Definition   |
|------------|-----------|
|`-V, --version`|output the version number|
|`-a, --add [repo]`|Add a git repo to manage list|
|`-l, --list`|List all tracked git repos|
|`-r, --remove [repo]`|Remove an entry from managed list|
|`--remove-all`|Remove all repos from managed list|
|`-s, --sync`|Syncs all added repos to remote|
|`--sync-one [repo]`|Syncs specific repo to remote|
|`--select [repo]`|Used to specify branch for further action|
|`-b, --branch [branch]`|Add branch to add to managed list, requires --select|
|`--remove-branch [branch]`|Removes branch from managed list, requires --select|
|`-h, --help`|output usage information|
### Sync

> By default, only the master branch is synced, you can add more with `--branch`

The `-s` option syncs all of the watched repos on the list to their
masters. However using the `--sync-one [repo]` can be used to
exclusively sync one repository to its remote.

The `-b` and `--branch` options require a specified `--select [repo]`
in order to add a branch to the managed list.
