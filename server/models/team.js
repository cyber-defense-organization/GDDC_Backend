var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var teamSchema = new Schema({
     name: String,
     password: String,
     score: Number,
     ICMP_Score: Number,
     SSH_Score: Number,
     HTTP_Score: Number,
     DNS_Score: Number,
     DB_Score: Number,
     FTP_Score: Number,
     services: 
          [{   
               // AD
               AD_Linux1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               AD_Linux2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               AD_Windows1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               AD_Windows2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               AD_Windows98: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               // MYSQL
               MYSQL_Linux1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               MYSQL_Linux2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               MYSQL_Windows1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               MYSQL_Windows2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               MYSQL_Windows98: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               // FTP
               FTP_Linux1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               FTP_Linux2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               FTP_Windows1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               FTP_Windows2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               FTP_Windows98: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               //ICMP
               ICMP_Linux1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String,
                    speed: String
               }],
               ICMP_Linux2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String,
                    speed: String
               }],
               ICMP_Windows1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String,
                    speed: String
               }],
               ICMP_Windows2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String,
                    speed: String
               }],
               ICMP_98: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String,
                    speed: String
               }],

               //SSH
               SSH_Linux1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               SSH_Linux2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               SSH_Windows1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               SSH_Windows2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               SSH_98: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],

               //DNS 
               DNS_Linux1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               DNS_Linux2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               DNS_Windows1: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               DNS_Windows2: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               DNS_98: [{
                    timeStamp: {type: Date},
                    status: {type: Boolean, default: false},
                    error: String
               }],
               
          }]
});

var team = mongoose.model("team", teamSchema);
module.exports = team;
