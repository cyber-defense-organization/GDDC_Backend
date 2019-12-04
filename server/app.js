const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
//express deps

const expressip = require('express-ip');

//dbConnection
const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

//dbdepends
var Score = require("./models/score")
var Team = require("./models/team")
var sTeam = require("./models/sTeam")

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
//output parser

app.use(expressip().getIpInfoMiddleware);


var rightToken = 'GDDC!' //Should be pulled from db and logged with datetime

app.get('/team', (req,res,next) => {
  res.send({
    Hello: 'Boi'
  })
})

app.get('/teamT/:teamName' , (req,res,next) => {
  var name = req.params.teamName;
  sTeam
  .findOne({name: name} , '')
  .exec(function(err, resp){
    if(err){
        console.log(err);
    }
    else{
        res.send({
          out: resp
        })
    }
})
})

app.get('/lastI/:teamName', (req,res,next) => {
  var name = req.params.teamName;
  Team //{'services.ICMP_Linux1':{$slice:[0, 3]}}
    .findOne({ name: name } , 'services.ICMP_Linux1')
    .where('services.ICMP_Linux1')
    .sort({'ICMP_Linux1.status':-1})
    .slice(0,3)
    .exec(function(err, resp){
      if(err){
          console.log(err);
      }
      else{
          res.send({
            out: resp
          })
      }
  })
})

// Random Comment

app.get('/tokenIn/:token', (req,res,next) => {
  const ipInfo = req.ipInfo;
  var token = req.params.token;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var allHeaders = req.headers

  if (token == rightToken) {
    //Do somekinda random string generation
    //Also store in database
    rightToken = 'GDDC2'
    nToken = rightToken
    res.send({
      msg: 'Token Validated!',
      newToken: nToken,
      tokenSent: token,
      senderIp: ip
    })
  }
  res.send({
    msg: 'Token Not Validated!',
    tokenSent: token,
    senderIp: ip,
    allHeaders: allHeaders,
    ipInfo: ipInfo
  })
})




app.listen(process.env.PORT || 8081)
