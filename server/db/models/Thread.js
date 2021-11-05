const Thread = {
	__name__: "Thread",
	__params__: {
		title: String,
		postLink: String,
		screenShotCreated: Boolean,
		createdTs: { type: Date, default: Date.now },
		threadShortId: String,
		verified: Boolean,
		platform: String,
		topics: [String],
		commenters: [String],
		found: Boolean
	}
}

module.exports = Thread;