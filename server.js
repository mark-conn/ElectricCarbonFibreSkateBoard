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






// SPEAK TO BOARD

// retreive the current rpm variable directly from board
app.get('/rpm', function(request, response){
    api.getCurrentRpm((err, result) => {
        if(err) console.log(err);
        else {
            response.send(result);    
        }
    });

});

// retreive the currentCap variable from board, calculate into a battery percentage
app.get('/batterylevel', function(request, response){
    api.getBatteryPercent(function(err, result){
        if(err) console.log(err);
        else {
            response.send(result);
        }
    });
});

// retreive the current rpm variable from board, calculate into a current speed
app.get('/currentspeed', function(request, response){
    api.getCurrentSpeed(function(err, result){
        if(err) console.log(err);
        else {
            response.send(result);
        }
    });
});

// receive a power level percentage from UI, calculate into a 'PULSE' variable, send this to the board    
app.get('/powerlevel/:percent', function(request, response){
    api.setPowerLevel(request.params.percent, function(err, result){
        if(err) console.log(err);
        else {
           response.send(result);
        }
    });
});

// receive a TOGGLE command from UI, send this command to the board to toggle lights
app.get('/lights', function(request, response){

    api.toggleLights((err, result) => {
        if(err) console.log("lights", err);
        else {
            response.send(result);
        }
    });
});



// SPEAK TO INTERNAL FUNCTIONS/DATABASE
app.get('/checktrip/:currentlocation/:distance/:duration', function(request, response) {

    api.tripChecker(request.params.currentlocation, request.params.distance, request.params.duration, function(err, result){
        if(err) console.log(err)
        else {
            response.send(result);
        }
    });
})

app.get('/starttrip/:currentlocation', function(request, response) {
    api.startTrip(request.params.currentlocation);
    response.send("executed");
    
});

app.get('/endtrip/:currentlocation', function(request, response){
    api.endTrip(request.params.currentlocation);
});




// SPEAK TO MAPS APIS
app.get('/getdistancematrix/:currentlocation/:destination', function(request, response){
    fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${request.params.currentlocation}&destinations=${request.params.destination}&mode=bicycling&language=en&avoid=highways&key=AIzaSyAizOC5hi8Wwkxshx-0sb0TE--2VV5zKIQ`)
        .then(function(result) {
            return result.json();
        }).then(function(json) {
            var distanceMatrix = {
                distance: json.rows[0].elements[0].distance,
                duration: json.rows[0].elements[0].duration
            };
            response.json(distanceMatrix);
        });
});

app.get('/getfirstmap/:currentlocation', function(request, response){
    fetch(`https://maps.googleapis.com/maps/api/staticmap?center=${request.params.currentlocation}&zoom=14&size=500x400&scale=2&maptype=roadmap&markers=size:mid%7Ccolor:cyan%7Clabel:U%7C${request.params.currentlocation}&key=AIzaSyCo3iW32jC7b_q2TkZ-qMy7q__hHSfWiuU`)
        .then(function(result) {
            return result.url;
        }).then(function(url) {
            response.send(url);
        });
});

app.get('/auto-complete/:currentlocation/:dest', function(request, response) {
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${request.params.dest}&location=${request.params.currentlocation}&radius=40&key=AIzaSyCVRuvkkz0kKVtYKowYGRC7s1JPy56GcHM`)
            .then(function(result){
               return result.json();
               
            }).then(function(json){
                return json.predictions.map(function(obj){
                    return obj.description;
                });      
              }).then(function(array){
                  response.send(array);
              });

});

app.get('/getresultmap/:currentlocation/:destination/:path', function(request, response){
    fetch(`https://maps.googleapis.com/maps/api/staticmap?size=500x400&scale=2&maptype=roadmap&markers=size:mid%7Ccolor:blue%7Clabel:U%7C${request.params.currentlocation}&markers=size:mid%7Ccolor:red%7Clabel:D%7C${request.params.destination}&path=weight:3%7Ccolor:blue%7Cenc:${request.params.path}&key=AIzaSyCo3iW32jC7b_q2TkZ-qMy7q__hHSfWiuU`)
        .then(function(result) {
            return result.url;
        }).then(function(url) {
            response.send(url);
        });
});

app.get('/path/:currentlocation/:destination', function(request, response){
    
    fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${request.params.currentlocation}&destination=${request.params.destination}&mode=bicycling&key=AIzaSyD02qmfhm121HIuQb3JWMVQzLtuo3XzBjk`)
    .then(function(result){
        return result.json();
    }).then(function(json){
        var polyline = encodeURIComponent(json.routes[0].overview_polyline.points);
        response.send(polyline);
    })
})


    
// SPEAK WITH REACT
app.use('/static', express.static(__dirname + '/static'));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/static/index.html');
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