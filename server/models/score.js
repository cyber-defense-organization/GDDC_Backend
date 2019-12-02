var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var scoreSchema = new Schema({
     name: String,
     scoreOverTime: [{
          score: Number,
          timeStamp: { type: Date, default: Date.now }
     }]
});

var score = mongoose.model("score", scoreSchema);
module.exports = score;
