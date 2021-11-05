const fs = require('fs');
const db = require("./server/db/db");
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function run() {
    const models = db().init();
    const threadLink = process.argv[2];
    const threadShortId = process.argv[3];
    const retry = process.argv[4] === '--retry';

    console.log("Thread Scraper running...");
    (async function scraper(retry) {
        try {
            let driver;
            if (process.env.ENV === "prod") {
                const options = new firefox.Options().setBinary('/usr/bin/geckodriver')
                options.addArguments("--headless");
                driver = new Builder()
                    .forBrowser('firefox')
                    .setFirefoxOptions(options)
                    .build();
            } else {
                driver = await new Builder().forBrowser('firefox').build();
            }

            console.log("okok")
            await driver.get(threadLink);
            console.log('trytry')
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
        driver.executeScript("document.body.style.zoom='67%'")
        const textToFind = threadShortId;

        const tweetCache = [];
        const findTweetText = async (tweet, isReply) => {
            let tweetWithText = false;
            const tweetId = await tweet.id_;
            if (tweetCache.includes(tweetId)) {
                console.log("Tweet already searched")
                return tweetWithText;
            } else {
                tweetCache.push(tweetId)
            }
            const tweetText = await tweet.getText();
            console.log(`Found tweet${isReply ? " (REPLY)" : ""}`, tweetText.substring(0, 10))
            if (tweetText.indexOf(textToFind) > -1) {
                console.log("text found in...", tweetText);
                tweetWithText = tweet
            }
            return tweetWithText;
        }

        let tweetWithText = false;
        let adjacentTweets;

        const findTopCommenters = async (adjacentTweets) => {
            const commenters = [];
            for (let adjacentTweet of adjacentTweets) {
                const elBy = By.css("a");
                const links = await adjacentTweet.findElements(elBy);
                if (links.length > 1) {
                    const name = await links[1].getText();
                    const comment = await adjacentTweet.getText();
                    commenters.push({
                        name,
                        comment,
                        hearts: 0,
                        angrys: 0,
                        laughs: 0,
                        rockets: 0
                    });
                }

            }
            return commenters;
        }

        const getAdjacentTweets = async (tweet, currentTweets) => {
            const adjacentTweets = [];
            const ids = [];
            const idMap = {};
            const tweetId = await tweet.id_;
            for (let currentTweet of currentTweets) {
                const id = await currentTweet.id_;
                idMap[id] = currentTweet;
                ids.push(id);
            }
            const tweetIndex = ids.indexOf(tweetId);
            for (let i = 0; i < ids.length; i++) {
                if (adjacentTweets.length >= 5) break;
                if (i >= tweetIndex - 5 && i < tweetIndex) {
                    adjacentTweets.push(idMap[ids[i]]);
                } else if (i > tweetIndex && i <= tweetIndex + 5) {
                    adjacentTweets.push(idMap[ids[i]]);
                }
            }
            return adjacentTweets;
        }

        const findTweetWithText = async () => {
            const elBy = By.css("article[data-testid='tweet']");
            console.log("start");
            await driver.wait(until.elementLocated(elBy, 100));
            console.log("Located")
            const currentTweets = await driver.findElements(elBy);
            // console.log(currentTweets);
            // await driver.wait(until.elementIsVisible(elements, 100));
            // const currentTweets = await driver.findElements()
            // find text

            console.log("Total tweets", currentTweets.length)
            for (let tweet of currentTweets) {
                try {
                    tweetWithText = await findTweetText(tweet, false);
                    if (tweetWithText) {
                        adjacentTweets = await getAdjacentTweets(tweetWithText, currentTweets);
                        break;
                    }
                } catch (e) {
                    console.log(e);
                    // swallow error keep going
                }
            }

            let someRepliesBy = By.xpath("//span[contains(text(), \"Show replies\")]");
            let moreRepliesBy = By.xpath("//span[contains(text(), \"Show more replies\")]");
            const someReplies = await driver.findElements(someRepliesBy);
            const moreReplies = await driver.findElements(moreRepliesBy);
            const currentReplies = someReplies.concat(moreReplies);
            console.log("Total reply buttons", currentReplies.length)
            for (let replyBtn of currentReplies) {
                if (tweetWithText) {
                    // ignore if text was found previously
                    break;
                }
                // const replyBtnPosition = await replyBtn.getRect();
                // console.log(replyBtnPosition);
                // driver.("arguments[0].click();", element)
                try {
                    await driver.executeScript((element) => {
                        element.click();
                    }, replyBtn);
                    await timeout(3000);
                } catch (e) {
                    console.log(e)
                    // swallow errors
                }

                const moreTweets = await driver.findElements(elBy);
                for (let newTweet of moreTweets) {
                    try {
                        if (currentTweets.includes(newTweet)) {
                            continue;
                        }
                        tweetWithText = await findTweetText(newTweet, true);
                        if (tweetWithText) {
                            adjacentTweets = await getAdjacentTweets(tweetWithText, currentTweets);
                            break;
                        }
                    } catch (e) {
                        console.log(e);
                        // swallow error
                    }
                }

            }

            if (!tweetWithText) {
                console.log("text not found");
                await driver.executeScript('window.scrollBy(0,2000)');
                await timeout(2000);
                await findTweetWithText();
            } else {
                console.log("Tweet FOUND!")
                return;
            }

        }

        try {
            if (retry) {
                await timeout(2000);
                await driver.takeScreenshot().then(
                    function (image) {
                        fs.writeFile(`./server/public/screenshots/${threadShortId}.png`, image, 'base64', function (err) {
                            console.log(err);
                        });
                    }
                );
                await driver.quit();
                process.exit(1);
            }
            await findTweetWithText();
            if (!tweetWithText) {
                console.log("Tweet not found!")
                await driver.quit();
                process.exit(1);
            }
            const topCommenters = await findTopCommenters(adjacentTweets)

            await driver.executeScript((elementToScroll) => {
                elementToScroll.scrollIntoView();
            }, tweetWithText);
            await driver.executeScript('window.scrollBy(0, -300)');
            await driver.takeScreenshot().then(
                function (image) {
                    fs.writeFile(`./server/public/screenshots/${threadShortId}.png`, image, 'base64', function (err) {
                        console.log(err);
                    });
                }
            );
            const commenterIds = []
            for (let commenter of topCommenters) {
                const newComment = new models["Commenter"](commenter)
                newComment.save();
                commenterIds.push(newComment._id);
            }
            await models["Thread"].findOneAndUpdate({ threadShortId }, { screenShotCreated: true, commenters: commenterIds });
            console.log("SAVED SCREENSHOT AND UDPATED DB")

        } catch (e) {
            console.log(e);
        }
        await driver.quit();
        process.exit(1);
    })(retry);
}

run();