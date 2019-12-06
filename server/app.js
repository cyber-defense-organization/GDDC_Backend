const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
var session = require('express-session')
//express deps

const nodemailer = require("nodemailer");

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

//app.use(expressip().getIpInfoMiddleware);

// function verifyJwt(token) {
//     var decoded_token = false;
//     jwt.verify(token, secret, (err, decoded) => {
//         if (!err) {
//             decoded_token = decoded;
//             next();
//         }
//       });
//     return decoded_token
// }

async function getCurrentShopScore(team) {
    const score = await sTeam.findOne({
        name: team
    }, "shopScore")
    return score.shopScore
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
})

app.get('/givepoint/:teamName/:points' , (req,res,next) => {
    var name = req.params.teamName;
    var points = parseInt(req.params.points);
    sTeam.update({
        name: name
    }, {
        '$inc': {
            shopScore: points,
            score : points
        }
    }, function(err, affected, resp) {
        if (err) {
            console.log(err, resp)
        }
    });
    res.send({
        status : true
    }) 
  })

app.get('/teamScore/:teamName' , (req,res,next) => {
  var name = req.params.teamName;
  sTeam
  .findOne({name: name} , 'score shopScore')
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
  .find({} , 'score name -_id')
  .sort({score: -1})
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

app.get('/shopScore/:teamName/:jwt', (req, res, next) => {
    var name = req.params.teamName;
    var token = req.params.jwt
    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            console.log(err)
            res.send({
                status: false,
                msg: "invalid JWT"
            })
        }else{
            if(name == decoded.name ) {
                var score = await getCurrentShopScore(name)
                res.send({
                    status : true,
                    score : score
                })
            } else {
                res.send({
                    error : "invalid jwt"
                })
            }
        }
      });
})

app.get('/transaction/:teamName/:jwt/:item/:price', async(req, res, next) => {
    var name = req.params.teamName;
    var token = req.params.jwt
    var item = req.params.item
    var price = req.params.price
    jwt.verify(token, secret, async (err, decoded) => {
        if (err) {
            console.log(err)
            res.send({
                status: false,
                msg: "invalid JWT"
            })
        }else{
            //console.log(decoded.name)
            if(decoded.name == name) {
                var score = await getCurrentShopScore(name)
                if(price <= score) {
                    let transporter = nodemailer.createTransport({
                        host: "mail.cock.li",
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                          user: "whiteteamstuffxd1@airmail.cc", // generated ethereal user
                          pass: "whiteteamstuffxd1"// generated ethereal password
                        }
                      }).catch(console.error);
                    
                      // send mail with defined transport object
                      let info = await transporter.sendMail({
                        from: '"white team" <whiteteamstuffxd1@airmail.cc>', // sender address
                        to: "rekarger@gmail.com", // list of receivers
                        subject: "shop notification", // Subject line
                        text: "Team:" + name + " Purchased: " + item + " For: " + price // plain text body
                      }).catch(console.error);
    
                    sTeam.update({
                        name: name
                    }, {
                        '$inc': {
                            shopScore: parseInt(price)*-1
                        }
                    }, function(err, affected, resp) {
                        if (err) {
                            console.log(err, resp)
                        }
                    });
                    res.send({
                        message : "successfully bought item"
                    })
                } else {
                    res.send({
                        message : "not enough robux"
                    })
                }
            } else {
                res.send({
                    message : "invalid jwt"
                })
            }
        }
      });
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
                .findOne({name: name} , '-password -_id -__v -name -score -shopScore')
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
