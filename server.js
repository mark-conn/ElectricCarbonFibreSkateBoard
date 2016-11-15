const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'connman', 
  password : '',
  database: 'ecf'
});

const appFunctions = require('./functions');
const api = appFunctions(connection);

app.use(morgan('dev'));


app.get('/rpm', function(request, response){
    api.getCurrentRpm(function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
            response.end();
        }
    });
});

app.get('/batterylevel', function(request, response){
    api.getBatteryPercent(function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
            response.end();
        }
    });
});

app.get('/currentspeed', function(request, response){
    api.getCurrentSpeed(function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
            response.end();
        }
    });
});
    
app.get('/powerlevel/:percent', function(request, response){
    api.setPowerLevel(request.params.percent, function(err, result){
        if(err) console.log(err);
        else {
            console.log(result);
        }
    });
});

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