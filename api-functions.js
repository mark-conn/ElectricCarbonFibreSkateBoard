const Particle = require('particle-api-js');
const fetch = require('node-fetch');
const particle = new Particle();
const wheelCircumference = 0.3;
const battery = 10;


// BOARD VARIABLES
// Switches to true when 'TRIP' mode is engaged
var trip = false;

var batteryPercent;
// While in 'TRIP', battery percent variable is pushed to this array every time it is updated
var batteryArray = [];

var speed;
// While in 'TRIP', speed variable is pushed to this array every time it is updated
var speedArray = [];

// BOARD VARIABLES
var currentCap;
var lights;
var powerLevel;
var rpm;
var tripDistance;
var pulse;



// MAP/TRIP VARIABLES
var currentLocation;
var tripStartTime;
var tripStartPoint;
var tripStartingBattery;



module.exports = function appAPI(connection) {
    var api = {

    setPowerLevel: function(percentage, callback) {
        
        // connect to board
        // takes percent input and 
        // creates a 'limit' variable between 1700-2100ms
        // current power level variable
        // find associated RPM from said power level
        // fins associated current draw from said power level
        // display new RPM as 'speed limit' on UI
        
        var minValue = 1000;
        var maxValue = 2000;
        pulse = (percentage * (maxValue - minValue))/100 + minValue;
        
        fetch(`http://192.168.0.210/${pulse}`).then((result) => {
            return result.json();
        }).then((json) => {
            callback(null, json);
        });
            
        
    },
    
    //UP TO DATE
    toggleLights: function(callback) {

      fetch('http://192.168.0.210/lights').then((result) => {

        return result.json();  
          
      }).then((json) => {

          lights = parseInt(json.lights);
          callback(null, lights);
          
      });
        
    },
    
    //UP TO DATE
    getCurrentSpeed: function(callback) {
        
       speed = rpm * wheelCircumference;
       callback(null,speed);
               
    },
    
    //UP TO DATE
    getCurrentRpm: function(callback) {
        
        fetch('http://192.168.0.210/rpm').then((result) => {
            return result.json();
            
        }).then((json) => {
            
            rpm = parseInt(json.rpm);
            callback(null, rpm);
            
        });
        
    },
    
    //UP TO DATE
    getBatteryPercent: function(callback) {
        
        // connect to board
        // request/receive percentage
        // battery percent variable
        // push existing battery percent to array
        // display new percent to UI
        
        fetch('http://192.168.0.210/').then((result) => {
            return result.json();
        }).then((json) => {
            
               currentCap = battery - parseInt(json['current']);
               batteryPercent = Math.round((1 - (currentCap/battery)) * 100);
               callback(null, batteryPercent);
        });
    },
    

    //TRIP FUNCTIONS
    
    //UP TO DATE -----> PERKS EDIT THEO VARIABLES
    tripChecker: function(location, distance, duration, callback) {
        
        var theoRpm;
        var theoCurrent;
        
            // var durationArray = duration.split(' ');
            // function cleanDuration(arr) {
            // return arr.filter((word) => {
            //   return word.length > 2 ? null : word;
            // });
            // }
            // duration = cleanDuration(durationArray);
            // duration.join(' ');
            // var minutes = duration.length > 1 ? duration[1] : duration[0];
            // var hours = duration.length > 1 ? duration[0] : 0;
            // hours = parseInt(hours);
            // minutes = parseInt(minutes);
            // minutes = minutes / 12;
            // var time = hours + minutes;
        
        
        var distanceArray = distance.split(' ');
        distance = distanceArray[0];

        currentLocation = location;
        // current power level variable
            powerLevel;
        
        // distance = kms from Google 
            tripDistance = distance;
        
        // battery = current battery percent variable
            batteryPercent;
        
        // distance/RPM = hours to complete trip
        theoRpm = 'wait out'
        theoCurrent = 'wait out'
        
        var hours = tripDistance / theoRpm;
        var tripCapacity = hours * theoCurrent;
        var tripCheckerResult = tripCapacity > currentCap ? "red" : tripCapacity = currentCap ? "yellow" : "green";
        
        callback(null, tripCheckerResult);
    },
    
    startTrip: function(location) {
        
        // get a starting time for the trip
        // get a starting location for the trip from Google API
        // get a starting battery reading
        
        tripStartTime = Date.now();
        
        // use navigator.geolocation
        // http://html5doctor.com/finding-your-position-with-geolocation/
        // user's current location should be ascertained from user device
        tripStartPoint = location;
        
        tripStartingBattery = batteryPercent;
        trip = true;
    
        
    },
    
    pauseTrip: function() {
        
        // if speed has remained at 0 for X minutes, TRIP will PAUSE,
        // engage a screen overlay with two options: END TRIP or CONTINUE
        
    },
    
    endTrip: function(location) {
        
        var tripEndTime = Date.now();
        
        // location from Google API
        var tripEndPoint = location;
        
        var speedArraySum = speedArray.reduce(function(a,b){
            return a + b;
        }, 0);
        
        var averageSpeed = speedArraySum / speedArray.length;
        
        var tripEndingBattery = batteryPercent;
        
        var powerUsage = tripStartingBattery - tripEndingBattery;
        
        // distance from Google Map API
       var distance = tripDistance;
        
        
        connection.query(
            `INSERT INTO trips(
                startTime,
                endTime,
                startPoint,
                endPoint,
                averageSpeed,
                powerUsage,
                distance
                ) VALUES (?,?,?,?,?,?,?,)`,
                [tripStartTime, tripEndTime, tripStartPoint, tripEndPoint, averageSpeed, powerUsage, distance]
            );
            
        speedArray.forEach(function(obj){
            connection.query(
                `INSERT INTO tripSpeeds(
                    speed,
                    time,
                    tripId
                    ) VALUES (?,?)`, [obj.speed, obj.time]
                    );
        });
    },
    
    
    };
    
    return api;
};