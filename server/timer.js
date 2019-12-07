const axios = require('axios');

var poll_seconds = 30

var teamWorkers = [
    "127.0.0.1:8082",
    "127.0.0.1:8083",
    "127.0.0.1:8084",
    "127.0.0.1:8085",
    "127.0.0.1:8086",
    "127.0.0.1:8087",
    "127.0.0.1:8088",
    "127.0.0.1:8089",
    "127.0.0.1:8090",
    "127.0.0.1:8091",
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
                console.log(index + ": error :" + error);
            })
        }
    }
}

setInterval(poll, poll_seconds*1000)