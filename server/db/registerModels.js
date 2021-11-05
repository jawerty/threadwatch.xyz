const mongoose = require("mongoose");
const Thread = require("./models/Thread");
const Commenter = require("./models/Commenter");
const Topic = require("./models/Topic");

const models = [Thread, Commenter, Topic]

function registerModels() {
	const modelMap = {};
	models.forEach((modelData) => {
		const schema = new mongoose.Schema(modelData.__params__);
		modelMap[modelData.__name__] = mongoose.model(modelData.__name__, schema);
	});

	return modelMap;
}

module.exports = registerModels;
