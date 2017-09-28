module.exports = (repoPath) => {
    let remoteHead, curHead, leadingHead;
    let toLog = "";
    let mergeFlag = false;
    let simplegit = require("simple-git")(repoPath)
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
};