#! /usr/bin/env node

const program = require("commander");
const storage = require('node-persist');
const username = require('username');
const path = require("path");
const fs = require("fs");
const colors = require('colors');
const sync = require('./sync');
const validate = require('./validate');

program
    .version("0.0.1")
    .usage("[options]")
    .option("-a, --add [repo]", "Add a git repo to manage list")
    .option("-l, --list", "List all tracked git repos")
    .option("-r, --remove [repo]", "Remove an entry from managed list")
    .option("    --remove-all", "Remove all repos from managed list")
    .option("-s, --sync", "Syncs all added repos to remote")
    .option("    --sync-one [repo]", "Syncs specific repo to remote")
    .option("--select [repo]", "Used to specify branch for further action")
    .option("-b, --branch [branch]", "Add branch to add to managed list, requires --select")
    .option("    --remove-branch [branch]", "Removes branch from managed list, requires --select")
    .parse(process.argv);

if (process.argv.length===2) program.outputHelp();

const homePath = "/home/" + username.sync() + "/.node-persist/";

storage.init({dir: homePath}).then(()=>{
    if (program.add) {
        let addPath = path.resolve(program.add);
        let addName = addPath.split("/").slice(-1)[0];
        if (!fs.existsSync(addPath+"/.git")) {
            console.log("Directory not a git");
            return
        }
        let allRepos = storage.getItemSync("allRepos");

        if (!allRepos){
            allRepos = {}
        }
        for (repo in Object.keys(allRepos)){
            if (repo[0] === addName) {
                console.log("Repo already added");
                return
            }
        }

        allRepos[addName] = [addPath, ["master"]];
        storage.setItem("allRepos", allRepos);
        console.log("Added " + addName);
    }

    if (program.list) {
        let gits = storage.getItemSync("allRepos") || [];
        if (!Object.keys(gits).length){
            console.log("There are no gits added");
            console.log("You can add one with git-manage --add git-repo-name");
            return
        }
        console.log("Added gits:");
        for (key in gits) {
            let repoName = key;
            let repoPath = gits[key];
            let valid = fs.existsSync(repoPath + "/.git");
            if (valid) {
                let spaceCounter = 30 - repoName.length;
                let spaces = "";
                for (let i=0;i<spaceCounter;i++){
                    spaces += " ";
                }
                console.log(key+spaces+repoPath);
            } else {
                console.log("Removing " + repoName + " at " + repoPath + " because not valid repo");
                delete gits[repoName]
            }
            storage.setItemSync("allRepos", gits);
        }
    }

    if (program.remove) {
        let gits = storage.getItemSync("allRepos");
        let index = -1;
        let rmPath = path.resolve(program.remove);
        let rmName = rmPath.split("/").slice(-1)[0];
        if (Object.keys(gits).indexOf(rmName)===-1) {
            console.log("Repo not found in list");
            return;
        }
        delete gits[rmName];

        storage.setItem("allRepos", gits);
        console.log("Removed: " + rmName);

    }

    if (program.removeAll){
        storage.setItemSync("allRepos", {});
        console.log("Removed all repos from manage list");
    }

    if (program.sync){

        let gits = storage.getItemSync("allRepos", {});

        for (git in gits){
            let valid = fs.existsSync(gits[git][0] + "/.git");
            if (valid){
                for (i in gits[git][1]){
                    sync(gits[git][0], gits[git][1][i]);
                }
            } else {
                console.log("Removing " + repoName + " at " + repoPath + " because not valid repo");
                delete gits[repoName];
            }
        }
        storage.setItemSync("allRepos", gits);

    }
    if (program.syncOne){
        let gits = storage.getItemSync("allRepos", {});
        let valid = fs.existsSync(gits[git] + "/.git");
        if (valid){
            sync(gits[program.syncOne], "master");
        } else {
            console.log("Removing " + repoName + " at " + repoPath + " because not valid repo");
            delete gits[repoName];
        }
        storage.setItemSync("allRepos", gits);
    }
    if (typeof program.select === "string" && typeof program.branch === "string"){
        let gits = storage.getItemSync("allRepos", {});
        if (Object.keys(gits).indexOf(program.select) === -1){
            console.log("Repo does not exist");
            return
        }
        let simplegit = require('simple-git')(gits[program.select][0])
            .raw([
                "remote",
                "update"
            ])
            .raw([
                "branch"
            ], (err, branches)=>{
                if (!err){
                    branchList = branches.trim().split('\n');
                    for (branch in branchList){
                        branchList[branch] = branchList[branch].trim().split(' ');
                        branchList[branch] = branchList[branch][branchList[branch].length-1];
                    }
                    if (branchList.indexOf(program.branch) === -1){
                        console.log("Branch not found");
                    } else {
                        if (gits[program.select][1].indexOf(program.select) === -1){
                            gits[program.select][1].push(program.branch);
                            storage.setItemSync("allRepos", gits);
                            console.log("Added " + program.branch + " to " + program.select);
                        } else {
                            console.log("Already added to " + program.select);
                        }
                    }
                } else {
                    console.log("Err: " + err)
                }
            });
    }
    if (typeof program.select === "string" && typeof program.removeBranch === "string"){
        let gits = storage.getItemSync("allRepos", {});
        if (Object.keys(gits).indexOf(program.select) === -1){
            console.log("Repo does not exist");
            return
        }
        let index = gits[program.select][1].indexOf(program.removeBranch);
        if (index === -1){
            console.log("Branch not managed");
        } else {
            gits[program.select][1].splice(index, 1);
            storage.setItemSync("allRepos", gits);
            console.log("Removed " + program.removeBranch + " from " + program.select);
        }
    }
}, (err)=>{
    console.log(err);
});

