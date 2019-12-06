var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamAccountsSchema = new Schema({
     teamName: String,
     teamPassword: String,
     createdAt: { type: Date, default: Date.now }

});

var teamAccounts = mongoose.model("teamAccounts", teamAccountsSchema);
module.exports = teamAccounts;