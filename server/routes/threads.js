const nanoid = require('nanoid');
const https = require('https')
const cheerio = require('cheerio');

// Load wink-nlp package  & helpers.
const winkNLP = require('wink-nlp');
const its = require('wink-nlp/src/its.js');
const as = require('wink-nlp/src/as.js');
const model = require('wink-eng-lite-model');
const nlp = winkNLP(model);

function getThreadPageInfo(postLink) {
	return new Promise((resolve, reject) => {
		const req = https.get(postLink, res => {
			res.on('data', d => {
				const pageContent = d;
				const $ = cheerio.load(pageContent);
				const title = $("title").text();
				const doc = nlp.readDoc(title);
				const topics = doc.entities().out();
				resolve({ topics, title })
			})
		});

		req.on('error', error => {
			reject({});
		});

		req.end()
	});
}

async function getThreads(req, res) {
	const models = req.app.get('models');
	const foundFilter = req.query.found;
	const recentFilter = req.query.recent;
	const topicFilter = req.query.topicFilter;
	const findQuery = {};
	const options = {};

	if (foundFilter == "true") {
		findQuery["screenShotCreated"] = true;
	}
	if (recentFilter) {
		options['$sort'] = { createdTs: -1 }
	}
	if (topicFilter) {
		findQuery["topics"] = topicFilter;
	}

	const threads = await models['Thread'].find(findQuery, null, options);
	res.json({ threads })
}

async function getThread(req, res) {
	const models = req.app.get('models');
	const threadId = req.params.threadId;
	console.log("Finding", threadId)
	const thread = await models['Thread'].findOne({ threadShortId: threadId });
	res.json({ thread })
}

async function addThread(req, res) {
	const models = req.app.get('models');
	let success, message, threadShortId;
	try {
		const maxAttempts = 10;
		const getUniqueShortId = async (attemptIndex) => {
			const newShortId = nanoid.nanoid(10);
			try {
				const foundThread = await models['Thread'].findOne({ threadShortId: newShortId })
				if (foundThread) {
					if (attemptIndex === maxAttempts) {
						return null;
					} else {
						await getUniqueShortId(attemptIndex + 1);
					}
				} else {
					return newShortId
				}
			} catch (e) {
				console.log(e);
				return null;
			}

		};

		const newShortId = await getUniqueShortId(0);
		if (!newShortId) {
			success = false
			message = "Could not create new thread link"
		} else {
			const threadPageInfo = await getThreadPageInfo(req.body.postLink)
			if (threadPageInfo.topics) {
				for (let topic of threadPageInfo.topics) {
					const existingTopic = await models['Topic'].findOneAndUpdate({ name: topic }, { $inc: { count: 1 } })
					if (!existingTopic) {
						const newTopic = new models['Topic']({ name: topic, count: 1 });
						newTopic.save();
					}
				}
			}
			const newThreadObject = {
				...req.body,
				...threadPageInfo,
				threadShortId: newShortId,
				screenShotCreated: false
			}
			const newThread = new models['Thread'](newThreadObject);
			newThread.save();
			threadShortId = newShortId;
			success = true;
			console.log("Thread saved!", newThread)
		}
	} catch (e) {
		message = e.message;
		success = false;
		console.log(e);
	}

	res.json({ success, message, threadShortId })
}

async function editThread(req, res) {
	const models = req.app.get('models');
	const _id = req.params.threadId;
	console.log("updating thread", _id)
	let success, message;
	try {
		await models['Thread'].findOneAndUpdate({ _id }, req.body);
		success = true;
	} catch (e) {
		message = e.message;
		success = false;
		console.log(e);
	}
	res.json({ success, message })
}


module.exports = {
	getThreads,
	getThread,
	addThread,
	editThread
}