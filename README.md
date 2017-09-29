# git-manage
[![Build Status](https://travis-ci.org/plunkinguitar/git-manage.svg?branch=master)](https://travis-ci.org/plunkinguitar/git-manage)
A cli tool to manage syncing of all local git repositories to their
remotes

# Installation
`npm install git-manage`

# Dependencies
None other than those specified in package.json

# Usage

> Currently only the master branch is synced

|Command     |Definition   |
|------------|-----------|
|`git-manage`|Displays help page|
|`git-manage -a [repo]`|Adds specified repo to managed list|
|`git-manage -r [repo]`|Removes specified repo from managed list|
|`git-manage --remove-all`|Removes all repos from manages list|
|`git-manage -l`|Lists all repos in watched list and their path|
|`git-manage -s`|Syncs all repos in watched list to their remotes|
|`git-manage --sync-one [repo]`|Syncs specified repo with its remote|
### Sync
The `-s` option syncs all of the watched repos on the list to their
masters. However using the `--sync-one [repo]` can be used to
exclusively sync one repository to its remote.
