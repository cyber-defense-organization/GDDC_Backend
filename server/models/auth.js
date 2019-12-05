var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var baseUser = "cdo"
var basePassword = "bb123#123"

var AuthSchema = new Schema({
    name: String,
    AD_Linux1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    AD_Linux2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    AD_Windows1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    AD_Windows2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    AD_Windows98_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    // MYSQL
    MYSQL_Linux1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    MYSQL_Linux2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    MYSQL_Windows1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    MYSQL_Windows2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    MYSQL_Windows98_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    // FTP
    FTP_Linux1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    FTP_Linux2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    FTP_Windows1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    FTP_Windows2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    FTP_Windows98_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    //ICMP
    ICMP_Linux1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword },

    },
    ICMP_Linux2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword },

    },
    ICMP_Windows1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword },

    },
    ICMP_Windows2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword },

    },
    ICMP_Windows98: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword },

    },

    //SSH
    SSH_Linux1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    SSH_Linux2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    SSH_Windows1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    SSH_Windows2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    SSH_Windows98: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },

    //DNS 
    DNS_Linux1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    DNS_Linux2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    DNS_Windows1_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    DNS_Windows2_Creds: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
    DNS_Windows98: {
        username: { type: String, default: baseUser },
        password: { type: String, default: basePassword }

    },
});

var Auth = mongoose.model("Auth", AuthSchema);
module.exports = Auth;