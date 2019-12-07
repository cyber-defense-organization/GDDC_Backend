const axios = require('axios');

var poll_seconds = 10

var teamWorkers = [
    "1982.1.1.0:8032",
    "1982.1.1.0:8039"
]

var services = [
    "SQL_ALL",
    "AD_ALL",
    "DNS_ALL",
    "ICMP_ALL",
    "WEB_ALL",
    "SSH_ALL"
]

function poll() {
    for (index = 0; index < teamWorkers.length; index++) { 
        for (service_index = 0; service_index < services.length; service_index++) { 
            var api = "http://" + teamWorkers[index] + "/" + services[service_index] + "/"
            var endpoint = api + (index+1)
            console.log(endpoint)
            axios.get(endpoint)
            .then(function (response) {
            })
            .catch(function (error) {
           //   console.log(error);
            })
        }
    }
}

setInterval(poll, poll_seconds*1000)