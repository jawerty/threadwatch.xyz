const mongoose = require("mongoose");
const registerModels = require("./registerModels")

function db() {
	return {
		init: () => {
			mongoose.connect('mongodb://localhost:27017/threadwatch');
			return registerModels()
		}
	}
}

module.exports = db;