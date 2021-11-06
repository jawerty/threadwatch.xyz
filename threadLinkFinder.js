const kill = require('tree-kill');
const { spawn } = require('child_process');
const fs = require('fs');
const db = require("./server/db/db");
const models = db().init();

const processes = {};

function spawnScraper(thread, retry) {
    const threadScraper = spawn('node', ["threadScraper.js", thread.postLink, thread.threadShortId, (retry) ? "--retry" : ""]);
    const writeStream = fs.createWriteStream(`./scraper-${thread.threadShortId}.log`);
    threadScraper.stdout.pipe(writeStream);

    threadScraper.on('close', (code) => {
        kill(threadScraper.pid)
        delete processes[thread.threadShortId];
        console.log(`threadScraper for ${thread.threadShortId} exited with code ${code}`);
    });

    processes[thread.threadShortId] = {
        timeStarted: new Date(),
        process: threadScraper
    }
}

async function threadLinkFinder() {
    const threadsNotFound = await models['Thread'].find(
        {
            $or: [
                { screenShotCreated: false },
                {
                    screenShotCreated: { $exists: false }
                }]
        });
    for (let threadNotFound of threadsNotFound) {
        console.log("trying thread", threadNotFound.threadShortId);
        let startProcess = true;
        let retry = false;
        if (threadNotFound.threadShortId in processes) {
            const processObject = processes[threadNotFound.threadShortId];
            const timeTillExpired = 1000 * 60 * 5; // ten minutes
            const isExpired = ((new Date().getTime() - processObject.timeStarted.getTime()) > timeTillExpired);
            if (!isExpired) {
                startProcess = false;
            } else {
                // close process
                retry = true;
                console.log('killing process')
                try {
                    kill(processObject.process.pid);
                } catch (e) {
                    console.log(e)
                }
            }
        }


        if (startProcess) {
            console.log("starting scraper")
            spawnScraper(threadNotFound, retry)
        } else {
            console.log("not starting scraper")
        }
    }
}
function run() {
    console.log("Thread link finder running")

    threadLinkFinder();
    setInterval(threadLinkFinder, 10000);


    clearProcesses = async () => {
        Object.keys(processes).forEach((threadShortId) => {
            kill(processes[threadShortId].process.pid)
        });
    }
    process.on('exit', clearProcesses);
    process.on('SIGUSR1', clearProcesses);
    process.on('SIGUSR2', clearProcesses);
    process.on('SIGINT', clearProcesses);
    process.on('uncaughtException', clearProcesses);

}

run()