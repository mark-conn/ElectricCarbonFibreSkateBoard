//Libraries 
#include <stdio.h>
#include <stdlib.h>

//VARIABLEs

   //SERVO
   Servo motor;

   //RC Remote & Power limit variable
   int rcPin = D0;

   //Input from the Rc Remote
   int rcVal;
   int limit;

   //LED PIN & Lights Variables
   int led1 = D7;
   int lights = 0; 

   //OTHER NEED THE ARDUINO code for rpm
   double rpm = 160.00;
   
   //Current Capacity of the battery (Ah)
   //actual current capacity calculated on the server
   double currentCap = 0;
   
   //Instantaneous current draw
   double calibration = 511.0;
   int currentSenor = A0;
   double currentDraw;
   
   //counter fot the current draw
   int currentCounter = 0;
//Functions
   
   //Toggle Lights
   int lightsToggle(String command);

   //RC control and Limiter
   int limiter(String command);
   int rcControl();

//Current Capacity & current draw function that operates on a timer
void current() {
   
   
   currentDraw = analogRead(currentSenor);
   
   //Conversion from seconds to hours and amps calculation 
   currentCap = (currentDraw - calibration) * currentCounter * 5 * (0.000277778) * (125/1023);
   
   currentCounter++;

}

//Timer
Timer timer(5000,current);

void setup() {
   
//CLOUD FUNCTION
   
   //Function call that toggles the lights on our off
   Particle.function("lightsToggle", lightsToggle);
   
   //Function to set limiter, to limit rpm of the motor through the ESC
   Particle.function("limiter", limiter);
   

//CLOUD VARIABLES
   
   //REAL TIME RPM VALUE
   Particle.variable("rpm", &rpm, DOUBLE);
   
   //Current Capacity of the battery
   Particle.variable("currentCap", &currentCap, DOUBLE);

//Serial Begin?!?
Serial.begin(9600);

//Start the timer
timer.start();

//PINS
   
   //LED PINS OR RELAY
   pinMode(led1, OUTPUT);
   
   //MOTOR PIN
   motor.attach(D1);
}

void loop() {
   
   //Rc Controll function call
   rcControl();
}

//Defined Functions

   //Toggle Lights Function 
   int lightsToggle(String command) {
       
       if(command == "on") {
           digitalWrite(led1, HIGH);
           return 1;
       }
       else {
           digitalWrite(led1, LOW);
           return 0;
       }
   }

   //Function to set the limit of the ESC
   int limiter(String command) {
       
       limit = (command).toInt();
       Serial.print(limit);
       return limit;
   }
   
   //Function to Control the max speed of the Motor
       //Assign the value of the rc-remote input to rcVal
   int rcControl() {
       rcVal = pulseIn(rcPin, HIGH);
       
       if(!limit) {
           if(rcVal > limit) {
               motor.write(limit);
           }
           else {
               motor.write(rcVal);
           }
       }
       else {
           motor.write(rcVal);
       }
   }
//Libraries 
#include <stdio.h>
#include <stdlib.h>


//VARIABLEs


    //SERVO
    Servo motor;


    //RC Remote & Power limit variable
    int rcPin = D0;


    //Input from the Rc Remote
    int rcVal;
    int limit;


    //LED PIN & Lights Variables
    int led1 = D7;
    int lights = 0; 


    //OTHER NEED THE ARDUINO code for rpm
    double rpm = 160.00;
    
    //Current Capacity of the battery (Ah)
    //actual current capacity calculated on the server
    double currentCap = 0;
    
    //Instantaneous current draw
    double calibration = 511.0;
    int currentSenor = A0;
    double currentDraw;
    
    //counter fot the current draw
    int currentCounter = 0;
//Functions
    
    //Toggle Lights
    int lightsToggle(String command);


    //RC control and Limiter
    int limiter(String command);
    int rcControl();


//Current Capacity & current draw function that operates on a timer
void current() {
    
    
    currentDraw = analogRead(currentSenor);
    
    //Conversion from seconds to hours and amps calculation 
    currentCap = (currentDraw - calibration) * currentCounter * 5 * (0.000277778) * (125/1023);
    
    currentCounter++;


}


//Timer
Timer timer(5000,current);


void setup() {
    
//CLOUD FUNCTION
    
    //Function call that toggles the lights on our off
    Particle.function("lightsToggle", lightsToggle);
    
    //Function to set limiter, to limit rpm of the motor through the ESC
    Particle.function("limiter", limiter);
    


//CLOUD VARIABLES
    
    //REAL TIME RPM VALUE
    Particle.variable("rpm", &rpm, DOUBLE);
    
    //Current Capacity of the battery
    Particle.variable("currentCap", &currentCap, DOUBLE);


//Serial Begin?!?
Serial.begin(9600);


//Start the timer
timer.start();


//PINS
    
    //LED PINS OR RELAY
    pinMode(led1, OUTPUT);
    
    //MOTOR PIN
    motor.attach(D1);
}


void loop() {
    
    //Rc Controll function call
    rcControl();
}


//Defined Functions


    //Toggle Lights Function 
    int lightsToggle(String command) {
        
        if(command == "on") {
            digitalWrite(led1, HIGH);
            return 1;
        }
        else {
            digitalWrite(led1, LOW);
            return 0;
        }
    }


    //Function to set the limit of the ESC
    int limiter(String command) {
        
        limit = (command).toInt();
        Serial.print(limit);
        return limit;
    }
    
    //Function to Control the max speed of the Motor
        //Assign the value of the rc-remote input to rcVal
    int rcControl() {
        rcVal = pulseIn(rcPin, HIGH);
        
        if(!limit) {
            if(rcVal > limit) {
                motor.write(limit);
            }
            else {
                motor.write(rcVal);
            }
        }
        else {
            motor.write(rcVal);
        }
    }