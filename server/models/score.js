var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var scoreSchema = new Schema({
     name: String,
     score: Number,
});

var score = mongoose.model("score", scoreSchema);
module.exports = score;
