const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const fetch = require('node-fetch');
const app = express();

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'connman', 
  password : '',
  database: 'ecf'
});

var appFunctions = require('./api-functions');
const api = appFunctions(connection);
app.use(morgan('dev'));


// retreive the current rpm variable directly from board
app.get('/rpm', function(request, response){
    api.getCurrentRpm(function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
            response.end();
        }
    });
});

// retreive the currentCap variable from board, calculate into a battery percentage
app.get('/batterylevel', function(request, response){
    api.getBatteryPercent(function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
            response.end();
        }
    });
});

// retreive the current rpm variable from board, calculate into a current speed
app.get('/currentspeed', function(request, response){
    api.getCurrentSpeed(function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
            response.end();
        }
    });
});

// receive a power level percentage from UI, calculate into a 'PULSE' variable, send this to the board    
app.get('/powerlevel/:percent', function(request, response){
    api.setPowerLevel(request.params.percent, function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
        }
    });
});

// receive a TOGGLE command from UI, send this command to the board to toggle lights
app.get('/lights/:toggle', function(request, response){
    api.toggleLights(request.params.toggle, function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
        }
    });
});


    


var port = process.env.PORT || 3000;
app.listen(port, function() {
  // This part will only work with Cloud9, and is meant to help you find the URL of your web server :)
  if (process.env.C9_HOSTNAME) {
    console.log('Web server is listening on https://' + process.env.C9_HOSTNAME);
  }
  else {
    console.log('Web server is listening on http://localhost:' + port);
  }
});