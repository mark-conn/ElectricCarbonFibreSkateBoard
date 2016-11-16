const Particle = require('particle-api-js');
const particle = new Particle();
const wheelCircumference = 0.3;
const battery = 10;

// Switches to true when 'TRIP' mode is engaged
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
var currentLocation;

// trip variables
var tripStartTime;
var tripStartPoint;
var tripStartingBattery;


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
    
    // needs AUTH-O    
    signIn: function() {},
    
    //works
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
    getCurrentRpm: function(callback) {
        
        api.variableCommunicator('rpm', function(err, result){
            if(err) console.log(err);
            else {
                
                result = result.body.result;
                callback(null, result);
                
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
               
               currentCap = battery - result.body.result;
               batteryPercent = Math.round((1 - (currentCap/battery)) * 100);
               
               if(trip) batteryArray.push({batteryPercent: batteryPercent, time: Date.now()});
               callback(null, batteryPercent);
           }
        });
        
    },
    
    
    //TRIP FUNCTIONS
    
    
    tripChecker: function() {
        
        // current power level variable
            powerLevel;
        
        // distance = kms from Google 
        
        // battery = current battery percent variable
            batteryPercent;
        
        // distance/RPM = hours to complete trip
        // current draw * hours = capacity trip(amp/hours)
        
        // capacity trip/ current cap
            // if / else enough power, display
            // good --> api.startTrip();
            // bad say "try turning lights off or lower power level"
            // 
        
    },
    
    newTrip: function() {
        
        // MAP renders and destination picked
        // MAIN renders and power level set, lights set
        api.tripChecker();
        // NEW TRIP button becomes START TRIP button
        
    },
    
    startTrip: function() {
        
        // get a starting time for the trip
        // get a starting location for the trip from Google API
        // get a starting battery reading
        
        tripStartTime = Date.now();
        
        // use navigator.geolocation
        // http://html5doctor.com/finding-your-position-with-geolocation/
        tripStartPoint = '';
        
        tripStartingBattery = batteryPercent;
        trip = true;

        
    },
    
    pauseTrip: function() {
        
        // if speed has remained at 0 for X minutes, TRIP will PAUSE,
        // engage a screen overlay with two options: END TRIP or CONTINUE
        
    },
    
    endTrip: function() {
        
        var tripEndTime = Date.now();
        
        // location from Google API
        var tripEndPoint = '';
        
        var speedArraySum = speedArray.reduce(function(a,b){
            return a + b;
        }, 0);
        
        var averageSpeed = speedArraySum / speedArray.length;
        
        var tripEndingBattery = batteryPercent;
        
        var powerUsage = tripStartingBattery - tripEndingBattery;
        
        // distance from Google Map API
        var distance = '';
        
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
                    time
                    ) VALUES (?,?)`, [obj.speed, obj.time]
                    );
        });
    },
    
    };
    
    return api;
};