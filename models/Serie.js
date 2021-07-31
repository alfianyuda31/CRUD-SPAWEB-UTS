const mongoose = require("mongoose")

const schema = mongoose.Schema({
	Title : String,
	Year : String,
	imdbID : String,
	Type : String,
	Poster : String
})

module.exports = mongoose.model("Serie", schema)