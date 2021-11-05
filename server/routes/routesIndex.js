const threads = require("./threads");
const commenters = require("./commenters");
const topics = require("./topics");

module.exports = {
	...threads,
	...commenters,
	...topics
}