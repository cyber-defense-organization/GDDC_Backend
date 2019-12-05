const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
var session = require('express-session')
    //express deps

const expressip = require('express-ip');

//dbConnection
const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

//dbdepends
var Score = require("./models/score")
var Team = require("./models/team")
var sTeam = require("./models/sTeam")
var passwordHash = require('password-hash');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
    //output parser

app.use(expressip().getIpInfoMiddleware);

app.post('/login', (req,res,next)=>{
  req.params.username;
  req.params.password;
  })

app.get('/team', (req, res, next) => {
    res.send({
        Hello: 'Boi'
    })
})

//Exploit waiting to happen but still here
app.get('/teamInfo/:teamName' , (req,res,next) => {
  var name = req.params.teamName;
  sTeam
  .findOne({name: name} , '-password -_id -__v -name -score')
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

app.get('/teamScore/:teamName' , (req,res,next) => {
  var name = req.params.teamName;
  sTeam
  .findOne({name: name} , 'score')
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

app.get('/teamScoreALL/' , (req,res,next) => {
  sTeam
  .find({} , 'score')
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


app.get("/login/:username/:password", (req, res, next) => {
    var password = req.params.password;
    var username = req.params.username
    const foundUser = sTeam.findOne({
        name: username
    })
    var foundPassword = foundUser["password"]
    console.log(foundPassword)
    var hashedPassword = passwordHash.generate(password);
    if (passwordHash.verify(password, password)) {

    }
})

//Exploit waiting to happen but still here
app.get('/teamInfo/:teamName', (req, res, next) => {
    var name = req.params.teamName;
    sTeam
        .findOne({ name: name }, '')
        .exec(function(err, resp) {
            if (err) {
                console.log(err);
            } else {
                res.send({
                    out: resp
                })
            }
        })
})

app.get('/lastI/:teamName', (req, res, next) => {
    var name = req.params.teamName;
    Team //{'services.ICMP_Linux1':{$slice:[0, 3]}}
        .findOne({ name: name }, 'services.ICMP_Linux1')
        .where('services.ICMP_Linux1')
        .sort({ 'ICMP_Linux1.status': -1 })
        .slice(0, 3)
        .exec(function(err, resp) {
            if (err) {
                console.log(err);
            } else {
                res.send({
                    out: resp
                })
            }
        })
})

app.listen(process.env.PORT || 8081)
