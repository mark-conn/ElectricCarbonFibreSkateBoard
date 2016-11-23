//Required Libraries
#include <Servo.h>
#include <Adafruit_CC3000.h>
#include <SPI.h>
#include "utility/debug.h"
#include "utility/socket.h"
#include <SimpleTimer.h>

//Pins Required for Adafruit CC3000
#define ADAFRUIT_CC3000_IRQ   3
#define ADAFRUIT_CC3000_VBAT  5
#define ADAFRUIT_CC3000_CS    10

//Throttle definitions
#define THROTTLE_SIGNAL_IN 0
#define THROTTLE_SIGNAL_IN_PIN 2
#define NEUTRAL_THROTTLE 1500

volatile int nThrottleIn = NEUTRAL_THROTTLE;
volatile unsigned long ulStartPeriod = 0;
volatile boolean bNewThrottleSignal = false;

//Servo/Esc and limit;
Servo esc;
int limit = 1500;

//Hall Sensor
double period, lowDuration, highDuration;
int hall = 7;
int rpm;

//Current Sensor
SimpleTimer currentTimer;
double calibration = 511.0;
double current, sensor;
double currentCap = 0; 
int currentCounter = 0;

//LEDs
int connectivityLed = 6;
int ecfLed = 8;
bool toggle = false;

//Create CC3000 instance
Adafruit_CC3000 cc3000 = Adafruit_CC3000(ADAFRUIT_CC3000_CS, ADAFRUIT_CC3000_IRQ, ADAFRUIT_CC3000_VBAT,
                                         SPI_CLOCK_DIVIDER); // you can change this clock speed
//Network Name, Password and Encryption 
#define WLAN_SSID       "ECF"  
#define WLAN_PASS       "ECFECFECF"
#define WLAN_SECURITY   WLAN_SEC_WPA2

//The port to listen for incoming TCP connections, 80 by default
#define LISTEN_PORT           80     

//Maximum length of the HTTP action that can be parsed.
#define MAX_ACTION            10

// Maximum length of the HTTP request path that can be parsed.
#define MAX_PATH              64      

//Size of buffer for incoming request.
#define BUFFER_SIZE           MAX_ACTION + MAX_PATH + 20

//Amount of time in milliseconds to wait for an incoming request to finish
#define TIMEOUT_MS            500

//Server instance
Adafruit_CC3000_Server httpServer(LISTEN_PORT);
uint8_t buffer[BUFFER_SIZE+1];
int bufindex = 0;
char action[MAX_ACTION+1];
char path[MAX_PATH+1];

void setup(void)
{
  Serial.begin(115200);

  //Attach Servo/Esc
  esc.attach(9);
  
  //Initializing pins
  pinMode(connectivityLed, OUTPUT);
  pinMode(hall, OUTPUT);
  pinMode(ecfLed, OUTPUT);

  //Timer calls current Sensor every ten seconds
  currentTimer.setInterval(10000, currentSensor);
  
  //Throttle Interrupt
  attachInterrupt(THROTTLE_SIGNAL_IN, calcInput, CHANGE);
  
  Serial.println(F("ECF DecodeMtl Final Project!\n")); 
  // Set up CC3000 and get connected to the wireless network.
  Serial.println(F("\nInitializing the CC3000 Wifi Shield..."));
  if (!cc3000.begin()) {
    Serial.println(F("\nInitialization sequence has been terminated due to failure."));
    while(1);
  }
  
  // Delete any old connection data on the module //
  Serial.println(F("\nDeleting old connection profiles"));
  if (!cc3000.deleteProfiles()) {
    Serial.println(F("\nFailed to delete connections!"));
    while(1);
  }

  //Attempt to connect to an access point
  Serial.print(F("\nAttempting to connect to ")); Serial.println(WLAN_SSID);
  if (!cc3000.connectToAP(WLAN_SSID, WLAN_PASS, WLAN_SECURITY, 5)) {
    Serial.println(F("\nFailed to connect after 5 attempts!"));
    digitalWrite(connectivityLed, LOW);
    while(1);
  } 
  else {
    Serial.println(F("Connected!"));
    digitalWrite(connectivityLed, HIGH);
  }

  //Wait for DHCP to complete
  Serial.println(F("\nRequest DHCP"));
  while (!cc3000.checkDHCP())
  {
    delay(100); // ToDo: Insert a DHCP timeout!
  }  

  // Display the IP address DNS, Gateway, etc.
  while (! displayConnectionDetails()) {
    delay(1000);
  }
  
  // Start listening for connections
  httpServer.begin();
  
  Serial.println(F("\nListening for connections..."));
}

void loop(void) {
  //Start Timer 
  currentTimer.run();
  throttle();
  hallSensor();

  // Try to get a client which is connected.
  Adafruit_CC3000_ClientRef client = httpServer.available();
  if (client) {
    Serial.println(F("Client connected."));
    // Process this request until it completes or times out.
    // Note that this is explicitly limited to handling one request at a time!

    // Clear the incoming data buffer and point to the beginning of it.
    bufindex = 0;
    memset(&buffer, 0, sizeof(buffer));
    
    // Clear action and path strings.
    memset(&action, 0, sizeof(action));
    memset(&path,   0, sizeof(path));

    // Set a timeout for reading all the incoming data.
    unsigned long endtime = millis() + TIMEOUT_MS;
    
    // Read all the incoming data until it can be parsed or the timeout expires.
    bool parsed = false;
    while (!parsed && (millis() < endtime) && (bufindex < BUFFER_SIZE)) {
      if (client.available()) {
        buffer[bufindex++] = client.read();
      }
      parsed = parseRequest(buffer, bufindex, action, path);
    }

    // Handle the request if it was parsed.
    if (parsed) {
      Serial.println(F("Processing request"));
      Serial.print(F("Action: ")); Serial.println(action);
      Serial.print(F("Path: ")); Serial.println(path);
      // Check the action to see if it was a GET request.
      if (strcmp(action, "GET") == 0) {
        // Respond with the path that was accessed.
        // First send the success response code.
        client.fastrprintln(F("HTTP/1.1 200 OK"));
        // Then send a few headers to identify the type of data returned and that
        // the connection will not be held open.
        client.fastrprintln(F("Content-Type: application/json"));
        client.fastrprintln(F("Connection: close"));
        client.fastrprintln(F("Server: Adafruit CC3000"));
        client.fastrprintln(F(""));

        
        //Read incoming path and determine and send appropreiate behavior
        if(String(path) == "/lights") {

            Serial.println("\nLights request");
            
            toggle = toggleLights();
            
            client.fastrprint(F("{\"light\": \""));
            client.print(toggle);
            client.fastrprint(F("\"}"));
        }
        else if(String(path) == "/rpm") {
          
            Serial.println("\nRPM request");
            
            client.fastrprint(F("{ \"rpm\": \""));
            client.print(rpm);
            client.fastrprint(F("\"}"));
              
         }
         else if(String(path) == "/current") {

            Serial.println("\nCurrent request");
            
            client.fastrprint(F("{ \"current\": \""));
            client.print(current);
            client.fastrprint(F("\"}"));              
        }
         else {
       
            Serial.println("\nLimit request");
            
            limitSet(String(path));
          
            client.fastrprint(F("{ \"limit\": \""));
            client.print(limit);
            client.fastrprint(F("\"}"));
        }
      }
      else {
        // Unsupported action, respond with an HTTP 405 method not allowed error.
        client.fastrprintln(F("HTTP/1.1 405 Method Not Allowed"));
        client.fastrprintln(F(""));
      }
    }

    // Wait a short period to make sure the response had time to send before
    // the connection is closed (the CC3000 sends data asyncronously).
    delay(100);

    // Close the connection when done.
    Serial.println(F("Client disconnected"));
    client.close();
  }
}

// Return true if the buffer contains an HTTP request.  Also returns the request
// path and action strings if the request was parsed.  This does not attempt to
// parse any HTTP headers because there really isn't enough memory to process
// them all.
// HTTP request looks like:
//  [method] [path] [version] \r\n
//  Header_key_1: Header_value_1 \r\n
//  ...
//  Header_key_n: Header_value_n \r\n
//  \r\n
bool parseRequest(uint8_t* buf, int bufSize, char* action, char* path) {
  // Check if the request ends with \r\n to signal end of first line.
  if (bufSize < 2)
    return false;
  if (buf[bufSize-2] == '\r' && buf[bufSize-1] == '\n') {
    parseFirstLine((char*)buf, action, path);
    return true;
  }
  return false;
}

// Parse the action and path from the first line of an HTTP request.
void parseFirstLine(char* line, char* action, char* path) {
  // Parse first word up to whitespace as action.
  char* lineaction = strtok(line, " ");
  if (lineaction != NULL)
    strncpy(action, lineaction, MAX_ACTION);
  // Parse second word up to whitespace as path.
  char* linepath = strtok(NULL, " ");
  if (linepath != NULL)
    strncpy(path, linepath, MAX_PATH);
}

// Tries to read the IP address and other connection details
bool displayConnectionDetails(void)
{
  uint32_t ipAddress, netmask, gateway, dhcpserv, dnsserv;
  
  if(!cc3000.getIPAddress(&ipAddress, &netmask, &gateway, &dhcpserv, &dnsserv))
  {
    Serial.println(F("Unable to retrieve the IP Address!\r\n"));
    return false;
  }
  else
  {
    Serial.print(F("\nIP Addr: ")); cc3000.printIPdotsRev(ipAddress);
    Serial.print(F("\nNetmask: ")); cc3000.printIPdotsRev(netmask);
    Serial.print(F("\nGateway: ")); cc3000.printIPdotsRev(gateway);
    Serial.print(F("\nDHCPsrv: ")); cc3000.printIPdotsRev(dhcpserv);
    Serial.print(F("\nDNSserv: ")); cc3000.printIPdotsRev(dnsserv);
    Serial.println();
    return true;
  }
}

//Throttle control of the motor;
void throttle() {
  
  if(bNewThrottleSignal) {
    if(nThrottleIn > limit) {
      esc.write(limit);
    }
    else { 
      esc.write(nThrottleIn);
    }
    bNewThrottleSignal = false;
  }
}

//Function calcInput for Throttle
void calcInput() {
  
  //if the pin is high, its the start of an interrupt
  if(digitalRead(THROTTLE_SIGNAL_IN_PIN) == HIGH) {

      ulStartPeriod = micros();
  }
  else {
    if(ulStartPeriod && (bNewThrottleSignal == false)) {

      nThrottleIn = (int)(micros() - ulStartPeriod);
      ulStartPeriod = 0;
      bNewThrottleSignal = true;
    }
  }
}

//Hall Sensor for RPM
void hallSensor() {
  
  lowDuration = pulseIn(hall, LOW);
  highDuration = pulseIn(hall, HIGH);
  period = 6 * (lowDuration + highDuration);
  if(period > 0) {
    rpm = (1/period) * 60 * 1000000;
  }
  else {
    rpm = 0;
  }
}
 
//Current Sensor for AMPS
void currentSensor() {
  sensor = analogRead(A0);
  currentCap = (sensor - calibration) * currentCounter * 10 * (0.000277778) * 5/1023.0;
  if(currentCap < 0) {
    currentCounter = 0; 
    currentCap = 0;
  }
  currentCounter++;
}

//LED's
bool toggleLights() {
  toggle ? digitalWrite(ecfLed, LOW) : digitalWrite(ecfLed, HIGH);
  return !toggle;
}

//Limiter Setter
void limitSet(String str) {
 limit =str.substring(1).toInt();
}

