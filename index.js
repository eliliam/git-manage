#! /usr/bin/env node

const program = require("commander");
const storage = require('node-persist');
const username = require('username');
const path = require("path");
const fs = require("fs");
const colors = require('colors');

program
    .version("0.0.1")
    .usage("[options]")
    .option("-a, --add [repo]", "Add a git repo to manage list")
    .option("-l, --list", "List all tracked git repos")
    .option("-r, --remove [repo]", "Remove an entry from managed list")
    .option("    --remove-all", "Remove all repos from managed list")
    .option("-s, --sync", "Syncs all added repos to remote")
    .option("    --sync-one [repo]", "Syncs specific repo to remote")
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

        if (Object.keys(allRepos).indexOf(addName) !== -1) {
            console.log("Repo already added");
            return
        }

        allRepos[addName] = addPath;
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
            let spaceCounter = 30;
            let spaces = "";
            for (c in repoName){
                spaceCounter--;
            }
            for (let i=0;i<spaceCounter;i++){
                spaces += " ";
            }
            console.log(key+spaces+repoPath);
        }
    }

    if (program.remove) {
        let gits = storage.getItemSync("allRepos");
        let index = -1;
        let rmPath = path.resolve(program.remove);
        let rmName = rmPath.split("/").slice(-1)[0];
        if (Object.keys(gits).indexOf(rmName)===-1) {
            console.log("Repo not found in list");
            return
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

        let gitArray = {};

        for (git in gits){
            let remoteHead, curHead, leadingHead;
            let toLog = "";
            let mergeFlag = false;
            let simplegit = require("simple-git")(gits[git])
                .silent(true)
                .raw([
                    "rev-parse",
                    "--show-toplevel"
                ], (err, res) =>{
                    if (!err){
                        toLog += res.trim().split("/").slice(-1)[0]+": ";
                    }
                })
                .raw(["fetch"])
                .raw([
                    "rev-parse",
                    "origin/master"
                ], (err, res)=>{
                    if (!err){
                        remoteHead = res.trim();
                    } else {
                        console.log(err);
                    }
                })
                .raw([
                    "rev-parse",
                    "master"
                ], (err, res)=>{
                    if (!err){
                        curHead = res.trim();
                    }
                })
                .raw([
                    "rev-list",
                    "--left-right",
                    "--count",
                    "origin/master",
                    "master"
                ], (err,res)=>{
                    let diffs = res.split("\t");
                    if (!err) {
                        if (diffs[0] !== "0" && diffs[1] !== "0"){
                            toLog += "Merge needed".red;
                            mergeFlag = true;
                        }
                    }
                })
                .raw([
                    "merge-base",
                    "master",
                    "origin/master"
                ], (err, res)=>{
                    if (!err && !mergeFlag){
                        leadingHead = res.trim();
                        if (leadingHead === remoteHead && leadingHead === curHead) {
                            toLog+= "All up to date".green;
                        } else if (leadingHead === remoteHead) {
                            toLog+= "Push needed".blue;
                            toLog+="\nPushing now...".blue;
                            simplegit.push("origin", "master");
                        } else if (leadingHead === curHead){
                            toLog+="Pull needed".blue;
                            toLog+="\nPulling now...".blue;
                            simplegit.pull("origin", "master")
                        } else if (leadingHead !== curHead && curHead !== remoteHead) {
                            toLog+="Merge needed".red;
                        }
                    }
                })
                .exec(()=>{
                    console.log(toLog);
                });
        }

    }
}, (err)=>{
    console.log(err);
});


