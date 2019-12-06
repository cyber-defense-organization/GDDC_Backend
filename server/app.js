const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
var session = require('express-session')
    //express deps

    
const fs   = require('fs');
const jwt  = require('jsonwebtoken');

const expressip = require('express-ip');

//dbConnection
const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();

//dbdepends
var Score = require("./models/score")
var Team = require("./models/team")
var sTeam = require("./models/sTeam")
var passwordHash = require('password-hash');

var secret = "bb123#123morelike123#123bb"

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
    //output parser

app.use(expressip().getIpInfoMiddleware);

function verifyJwt(token) {
    var decoded_token = false;
    jwt.verify(token, secret, (err, decoded) => {
        if (!err) {
            decoded_token = decoded;
            next();
        }
      });
    return decoded_token
}

app.post('/login', async (req,res,next)=>{
  var name = req.body.username;
  var pass = req.body.password; 
  //console.log(name)
  const foundUser = await sTeam.findOne({
        name: name
  }, 'password -_id')
    if(foundUser.password == pass) {
        let token = jwt.sign({name: name},
            secret,
            { expiresIn: '24h' // expires in 24 hours
            }
            );
        res.send({
            jwtToken: token,
            team : name,
            status : true
        })
    } else {
        res.send({
            status : false
        }) 
    }
  // console.log(foundUser)
//   sTeam
//   .findOne({name: name} , 'password')
//   .exec(function(err, resp){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(resp)
//         console.log(pass)
//         if(resp == pass) {
//             let token = jwt.sign({name: name},
//                 secret,
//                 { expiresIn: '24h' // expires in 24 hours
//                 }
//               );
//             res.send({
//                 jwtToken: token
//             })
//         }
//     }
// })

})

app.get('/team', (req, res, next) => {
    res.send({
        Hello: 'Boi'
    })
})

//Exploit waiting to happen but still here
// app.get('/teamInfo/:teamName' , (req,res,next) => {
//   var name = req.params.teamName;
//   sTeam
//   .findOne({name: name} , '-password -_id -__v -name -score')
//   .exec(function(err, resp){
//     if(err){
//         console.log(err);
//     }
//     else{
//         res.send({
//           out: resp
//         })
//     }
// })
// })

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

// Exploit waiting to happen but still here
app.get('/teamInfo/:teamName/:jwt', (req, res, next) => {
    var name = req.params.teamName;
    var token = req.params.jwt
    //var jwt_decoded = verifyJwt(jwt)
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log(err)
            res.send({
                status: false,
                msg: "invalid JWT"
            })
        }else{
            //console.log(decoded.name)
            if(decoded.name = name) {
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
            } else {
                res.send({
                    error : "invalid jwt"
                })
            }
        }
      });
    //console.log(jwt_decoded)
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
