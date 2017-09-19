#! /usr/bin/env node

const program = require("commander");
const storage = require('node-persist');

program
    .version("0.0.1")
    .usage("[options]")
    .option("-a, --add [repo]", "Add a git repo to manage list")
    .option("-l, --list", "List all tracked git repos")
    .option("-d, --delete [repo]", "Remove an entry from tracked list")
    .option("-s, --sync", "Syncs all added repos to remote")
    .parse(process.argv);

storage.initSync();

if (program.add) {
    let allRepos = storage.getItemSync("allRepos");
    if (!allRepos){
        allRepos = []
    }

    console.log(program.add);
    allRepos.push(program.add);
    storage.setItem("allRepos", allRepos);
}

if (program.list) {
    console.log(storage.getItemSync("allRepos"));
}

if (program.delete) {
    let allRepos = storage.getItemSync("allRepos");
    let index = allRepos.indexOf(program.delete);
    allRepos.splice(index, 1);
    storage.setItem("allRepos", allRepos);
}