const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
//express deps

const expressip = require('express-ip');


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
//output parser

app.use(expressip().getIpInfoMiddleware);

//App deps
const fs = require('fs')
const {google} = require('googleapis')
const authy = require('./authy')
//const getOne = require('./gCalls/getOne') //Fix this in the future
//const gCall = require

//Change this to the actually DB
const SHEET_ID = '1AaeBAWfFyba7Fdr2Oq3na0yy5uotJpQzCt-5I1HGGjo'

const SHEET_PATH = 'sheet.json';
var sheets = {};
var gids = [];

// Read and Auth
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading sheet file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  //auth = JSON.parse(content);
  authy.authorize(JSON.parse(content), authStart);
})
// Confirm Oauth
function authStart(auth){
  sheets = google.sheets({version: 'v4', auth});
  getSheetIds();
  fs.writeFile(SHEET_PATH, JSON.stringify(sheets), (err) => {
    if (err) return console.error(err);
    console.log('-- Sheet stored to', SHEET_PATH, ' --');
  });
  console.log('-- OAuth Was Successful! --');
  //getOne.init();
}
//Grabs all sheet IDs
//TODO add support for adding more sheets to table
function getSheetIds(){
  //console.log('Getting Sheet Ids');
  sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID
    })
  .then((resp) => {
    //console.log(resp.data.values[0][0] , 'RIGHT HERE')
    if (resp.status != 200) {
      console.log('--- failed to get sheet IDs--');
    }else {
      for (var i = 0; i < resp.data.sheets.length; i++) {
        //console.log(resp.data.sheets[i].properties.title,':',resp.data.sheets[i].properties.sheetId)
        var title = resp.data.sheets[i].properties.title;
        var id = resp.data.sheets[i].properties.sheetId;
        gids.push({
          title, id
        })
      }
      console.log('-- Gids Cataloged --')
      //console.log(gids)
      // console.log(resp.data.sheets[1].properties.sheetId);
    }
  })
  .catch();
}
//Finds the GID from name and list of GIDS
function findGID(titleIn) {
  for(var i = 0; i < gids.length; i++){
    if(gids[i].title == titleIn){
      return gids[i].id;
    }
  }
}

String.prototype.to10 = function(base) {
  var lvl = this.length - 1;
  var val = (base || 0) + Math.pow(26, lvl) * (this[0].toUpperCase().charCodeAt() - 64 - (lvl ? 0 : 1));
  return (this.length > 1) ? (this.substr(1, this.length - 1)).to10(val) : val;
}
// https://gist.github.com/tanaikech/95c7cd650837f33a564babcaf013cae0
function convRtoV(a1notation) {
  var data = a1notation.match(/(^.+)!(.+):(.+$)/);
  //var ss = SpreadsheetApp.openById(sheetid).getSheetByName(data[1]);
  var co1 = data[2].match(/(\D+)(\d+)/);
  var co2 = data[3].match(/(\D+)(\d+)/);
  var gridRange = {
    //sheetId: ss.getSheetId(),
    sheetId: findGID(data[1]),
    startRowIndex: co1 ? parseInt(co1[2], 10) - 1 : null,
    endRowIndex: co2 ? parseInt(co2[2], 10) : null,
    startColumnIndex: co1 ? co1[1].to10() : data[2].to10(),
    endColumnIndex: co2 ? co2[1].to10(1) : data[3].to10(1),
  };
  if (gridRange.startRowIndex == null) delete gridRange.startRowIndex;
  if (gridRange.endRowIndex == null) delete gridRange.endRowIndex;
  return gridRange;
}

var rightToken = 'GDDC!' //Should be pulled from db and logged with datetime

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

app.get('/update/:range/:value', (req, res, next) => {
  var range = req.params.range;
  var value = req.params.value;
  console.log(range , '---' , value)
  sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    'range':range,
    valueInputOption: 'RAW',
    //insertDataOption: 'OVERWRITE',
    requestBody: {
      values: [
        [value],
      ],
    },
  })
  .then((resp) =>{
    //console.log(resp);
    if (resp.status != 200) {
      console.log(resp);
    }else {
      res.send({
        Updated: resp.data.updatedRange,
        content: resp.config.data.values[0][0],
        response: resp.status
       })
    }
  })
  .catch(next);
})

app.get('/updateColorT/:range/:value', (req, res, next) => {
  var range = req.params.range;
  var value = req.params.value.split(':');
  var convRange = convRtoV(range);
  var red = value[0];
  var blue = value[1];
  var green = value[2];
  let requests = [];
  let values = [];


  requests.push({
    'updateCells': {
      "rows": [
        {
          "values": [
            {
                "userEnteredFormat": {
                  "backgroundColor": {
                    "red": red,
                    "green": blue,
                    "blue": green,
                    // "alpha": number
                  },
                },
            },
            {
                "userEnteredFormat": {
                  "backgroundColor": {
                    "red": red,
                    "green": blue,
                    "blue": green,
                    // "alpha": number
                  },
                },
            },
            {
                "userEnteredFormat": {
                  "backgroundColor": {
                    "red": red,
                    "green": blue,
                    "blue": green,
                    // "alpha": number
                  },
                },
            },
            {
                "userEnteredFormat": {
                  "backgroundColor": {
                    "red": red,
                    "green": blue,
                    "blue": green,
                    // "alpha": number
                  },
                },
            },
          ]
        }
      ],
      "fields": '*',
      "range": {
        sheetId: 1628871117,
        startRowIndex: 0,
        endRowIndex: 3,
        startColumnIndex: 0,
        endColumnIndex: 3
      },
    }
  });
  // requests[0].updateCells.rows.values[0] = {'hey': 'o'}
  // console.log(requests[0].updateCells.rows[0].values[0]);
  // console.log('whaaa')
  const batchUpdateRequest = {requests};
  sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: batchUpdateRequest
  })
  .then((resp) =>{
    //console.log(resp);
    if (resp.status != 200) {
      console.log(resp);
    }else {
      res.send({
        respData: resp,
        response: resp.status
       })
    }
  })
  .catch(next);
})

app.get('/updateColor/:range/:value', (req, res, next) => {
  var range = req.params.range;
  var value = req.params.value.split(':');
  var convRange = convRtoV(range);
  var red = value[0];
  var blue = value[1];
  var green = value[2];
  let requests = [];
  let values = [];
  let rows = [];

  var nRows = convRange.endRowIndex - convRange.startRowIndex
  var nCols = convRange.endColumnIndex - convRange.startColumnIndex
  var nCells = nRows * nCols;

  console.log(nCellEffect);
  //TODO Add intergration for looping through rows and cols
  // var objBuild = {}
  // for (var i = 0; i < nRows.length; i++) {
  //   rows[i].push({
  //     for (var b = 0; b < nCols.length; b++) {
  //       nCols[i]
  //     }
  //   });
  // }

  for (var i = 0; i < nCells; i++) {
    values.push({

      'values': {
        "userEnteredFormat": {
          "backgroundColor": {
            "red": red,
            "green": blue,
            "blue": green,
            // "alpha": number
          },
        },
      },
    });
  }


  requests.push({
    'updateCells': {
      "rows": [
        {
          "values": values
        }
      ],
      "fields": '*',
      "range": convRange,
    }
  });
  // requests[0].updateCells.rows.values[0] = {'hey': 'o'}
  // console.log(requests[0].updateCells.rows[0].values[0]);
  // console.log('whaaa')
  const batchUpdateRequest = {requests};
  sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: batchUpdateRequest
  })
  .then((resp) =>{
    //console.log(resp);
    if (resp.status != 200) {
      console.log(resp);
    }else {
      res.send({
        respData: resp,
        response: resp.status
       })
    }
  })
  .catch(next);
})

app.get("/get/:range", (req, res, next) => {
  var range = req.params.range;
  //console.log(range, "-----in");
  sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      'range':range,
    })
  .then((resp) => {
    //console.log(resp.data.values[0][0] , 'RIGHT HERE')
    if (resp.status != 200) {
      console.log(resp);
    }else {
      //console.log(resp);
      res.send({
        result : resp.data.values[0][0],
        response: resp.status,
        //respData: resp
      });
    }
  })
  .catch(next);
});

app.get("/getRange/:range", (req, res, next) => {
  var range = req.params.range;
  //console.log(range, "-----in");
  sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      'range':range,
    })
  .then((resp) => {
    //console.log(resp.data.values[0][0] , 'RIGHT HERE')
    if (resp.status != 200) {
      console.log(resp);
    }else {
      res.send({
        result : resp.data.values,
        response: resp.status,
        //respData: resp
      });
    }
  })
  .catch(next);
});

app.get("/getColor/:range", (req, res, next) => {
  var range = req.params.range;
  //console.log(range, "-----in");
  sheets.spreadsheets.get({
      spreadsheetId: SHEET_ID,
      'ranges':range,
      includeGridData: true,
    })
  .then((resp) => {
    //console.log(resp.data.values[0][0] , 'RIGHT HERE')
    if (resp.status != 200) {
      console.log(resp);
    }else {
      //console.log(resp);
      //console.log(resp.data.sheets.data)
      res.send({
        color: resp.data.sheets[0].data[0].rowData[0].values[0].userEnteredFormat.backgroundColor,
        // .values[0].userEnteredFormat.backgroundColor,
        //respData: resp,
        //result : resp.data.values[0][0],
        response: resp.status
      });
    }
  })
  .catch(next);
});



app.listen(process.env.PORT || 8081)
