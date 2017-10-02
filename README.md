# git-manage
[![Build Status](https://travis-ci.org/plunkinguitar/git-manage.svg?branch=master)](https://travis-ci.org/plunkinguitar/git-manage)
A cli tool to manage syncing of all local git repositories to their
remotes

# Installation
`npm install git-manage`

# Usage
|Command     |Definition   |
|------------|-----------|
|`git-manage`|Displays help page|
|`git-manage -a [repo]`|Adds specified repo to managed list|
|`git-manage -r [repo]`|Removes specified repo from managed list|
|`git-manage --remove-all`|Removes all repos from manages list|
|`git-manage -l`|Lists all repos in watched list and their path|
|`git-manage -s`|Syncs all repos in watched list to their remotes|
|`git-manage --sync-one [repo]`|Syncs specified repo with its remote|
|`git-manage --select [repo] -b [branch]`|Adds branch of specified repo to managed list|

### Sync

> By default, only the master branch is synced, you can add more with `--branch`

The `-s` option syncs all of the watched repos on the list to their
masters. However using the `--sync-one [repo]` can be used to
exclusively sync one repository to its remote.

The `-b` and `--branch` options require a specified `--select [repo]`
in order to add a branch to the managed list.