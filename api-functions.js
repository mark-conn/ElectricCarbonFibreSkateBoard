const Particle = require('particle-api-js');
const particle = new Particle();
const wheelCircumference = 0.3;
const battery = 10;

var trip = false;

var batteryPercent;
// While in 'TRIP', battery percent variable is pushed to this array every time it is updated
var batteryArray = [];

var speed;
// While in 'TRIP', speed variable is pushed to this array every time it is updated
var speedArray = [];

var lights;
var powerLevel;
var rpm;
var tripDistance;
var currentCap;


module.exports = function appAPI(connection) {
    var api = {
    
    //activates functions on the board to change variables
    functionCommunicator: function(name, argument, callback) {
        var functionName = name;
        
        functionName = particle.callFunction({
            deviceId: '3d0023001647353236343033',
            name: name.toString(),
            argument: argument.toString(),
            auth: '87051f1c2296c6b19fec93fe94d92961da6a8291'
        });
        
        functionName.then(
        function(data) {
            callback(null, data);
            
        },
        function(err) {
            callback(err);
        });
        
        
    },
    
    //gets variables from the board
    variableCommunicator: function(name, callback) {
        var variableName = name;
        
        variableName = particle.getVariable({
            deviceId: '3d0023001647353236343033',
            name: name,
            auth: '87051f1c2296c6b19fec93fe94d92961da6a8291'
        });
        
        variableName.then(
        function(data) {
            callback(null, data);
            
        },
        function(err) {
            callback(err);
        });
        
        
    },
        
    signIn: function() {},
    
    setPowerLevel: function(percentage) {
        
        // connect to board
        // takes percent input and 
        // creates a 'limit' variable between 1700-2100ms
        // current power level variable
        // find associated RPM from said power level
        // fins associated current draw from said power level
        // display new RPM as 'speed limit' on UI
        
        var minValue = 1700;
        var maxValue = 2100;
        var pulse = (percentage * (maxValue - minValue))/100 + minValue;
        api.functionCommunicator('limiter', pulse);
        
    },
    
    //works
    toggleLights: function(toggle, callback) {
        
        // connect to board
        // send 'toggle' parameter of on or off
        // triggers board function for lights
        // current lights variable
        lights = toggle;
        api.functionCommunicator('lightsToggle', toggle);

    },
    
    //works
    getCurrentSpeed: function(callback) {
        
        // connect to board
        // request/recieve RPM
        // use RPM to calculate speed
        // current speed variable
        // push existing speed to array
        // display new speed to UI
        
        api.variableCommunicator('rpm', function(err, result){
            if(err) console.log(err);
            else {
               result = result.body.result;
               speed = result * wheelCircumference;
               if(trip) speedArray.push({speed: speed, time: Date.now()});
               callback(null, speed);
            }
        });
        
    },
    
    //works
    getBatteryPercent: function(callback) {
        
        // connect to board
        // request/receive percentage
        // battery percent variable
        // push existing battery percent to array
        // display new percent to UI
        
        api.variableCommunicator('currentCap', function(err, result){
           if(err) callback(err);
           else {
               currentCap = result.body.result;
               batteryPercent = Math.round((1 - (currentCap/battery)) * 100);
               if(trip) batteryArray.push({batteryPercent: batteryPercent, time: Date.now()});
               callback(null, batteryPercent);
           }
        });
        
    },
    
    tripChecker: function(distance) {
        
        // current power level variable
            // deduce RPM
            // current draw
        
        // distance = kms from Google 
        // battery = current battery percent variable
            // current capacity = (battery - current average draw * time)
        
        // distance/RPM = hours to complete trip
        // current draw * hours = capacity trip(amp/hours)
        
        // capacity trip/ current cap
            // if / else enough power, display
            // good or bad
        
    },
    
    newTrip: function() {},
    
    startTrip: function() {},
    
    pauseTrip: function() {},
    
    endTrip: function() {},
    
    
    
    };
    return api;
};