# git-manage
[![Build Status](https://travis-ci.org/plunkinguitar/git-manage.svg?branch=master)](https://travis-ci.org/plunkinguitar/git-manage)
A cli tool to manage syncing of all local git repositories to their
remotes

# Installation
`npm install git-manage`

# Usage
|Command     |Definition   |
|------------|-----------|
|`-h`|Displays help page|
|`-a [repo]`|Adds specified repo to managed list|
|`-r [repo]`|Removes specified repo from managed list|
|`--remove-all`|Removes all repos from manages list|
|`-l`|Lists all repos in watched list and their path|
|`-s`|Syncs all repos in watched list to their remotes|
|`--sync-one [repo]`|Syncs specified repo with its remote|
|`--select [repo]`|Selects repo for further modification, used with `--branch` and `--remove-branch`|
|`-b [repo]`|Adds specified branch to repo managed list, must be used with `--select`
|`--remove-branch [branch]`|Removes specified branch from repo managed list, must be used with `--select`|
### Sync

> By default, only the master branch is synced, you can add more with `--branch`

The `-s` option syncs all of the watched repos on the list to their
masters. However using the `--sync-one [repo]` can be used to
exclusively sync one repository to its remote.

The `-b` and `--branch` options require a specified `--select [repo]`
in order to add a branch to the managed list.