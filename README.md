#Electric Carbon Fibre

Electric Carbon Fibre is the name of a smart skateboard being developed by Engineering students at Concordia University in Montreal, Quebec. As part of this project, a mobile-first web app was envisioned to allow control over the functions of the board, to enable users to do things such as toggle lights, set speed limits and read data such as battery life and rpm.

This web app was built by three students as their final project for the DecodeMTL coding bootcamp. The timeline for all planning, coding and presentation was 2 weeks.


#PHASE 1) Planning

The app was imagined as having basic features and functionality and was to be a mobile application to be used in conjunction with a basic remote control to throttle the board.  During the planning phase we established the following outline for the desired functionality:

- Lights: to be able to turn on/off the skateboard's lights with a button on the app

- Battery: to be able to read the current from the battery and display a percentage remaining to the user.

- Set Power Level: to allow the user to set a 'limit' on how fast the motor can run to control the speed level.  

- Speed: read the rpm from the motor and display a live kph to the user.


In addition to raw functions between the app and the board, the app was planned to use its own features to enrich the functionality and build on the existing data provided.

- Map Interface: feature elements of Google Maps APIs to help users plan trips and gather data for other functions.

- Trip Checker: using data from map (distance, time) and board (power level, lights), be able to tell the user if they will have enough power to reach their destination.

- Database of trips: to record all of the user's trips in order to push them to a database to record and later display interesting results for the user.


#Designing the Stack

Having learned certain technologies in the DecodeMTL bootcamp, the app was designed with a stack that would take advantage of our existing skills and allow us to further explore recently discovered tools.

Hardware: In the planning phase we had determined to use the Particle.io system and adjoining Photon board manipulate the board.  This would involve coding on the Particle IDE in C.

Server-side: The back end was planned as a Node.js server built with Express.  It was also to include a RESTful API to hold all of the functions that spoke between the user, the server, the map APIs and the hardware.  The server was designed to do all of the 'heavy lifting' and calculation of raw variables from the board as to alleviate stress from the hardware.

User-Interface: The front end was planned as using React and CSS3.  The main interface would house all of the components (buttons, tachometers, battery read etc.) in the style of a heads up display.  A separate interface would be built specifically for the map functions.


#PHASE 2) Execution

During the first couple of days of execution, things went very smoothly.  We setup our Express server quickly as well as a basic React boilerplate.  Our front-end team member began working on Auth-0 implementation.  Meanwhile, the back-end and hardware side were able to establish communication between the server and the Particle cloud on day one.  We tested by successfully turning lights on and off with our server-side API.  We then continued building variables on the hardware side and API functions/formulas on the server side.

On day three we brought in the hardware (BLDC motor, remote control(receiver/transmitter), battery, electric speed controller).  This is when we had our first major setback which would entirely change our hardware configuration.  

The Particle.io system uses a cloud.  Essentially, our server sends data to this cloud, which then handles the transfer of the data to the piece(s) of hardware.  It integrates easily with a node server, which was a perfect fit.  We had already setup this communication, and were now just testing it with the hardware.  Unfortunately, it wasn't communicating through our remote control, and we had no idea why.

This problem evaded us for days.  While work continued on the front-end, our hardware/back-end connection came to a grinding halt why we tried to determine what the issue was.  At this point the back-end element branched off to begin creating the map interface for time efficiency.

Our hardware member - after exhaustive participation in the Particle and various other forums - was eventually able to determine that the pulse waves of the remote control and the photon board were not compatible and there was no existing way to modify them.  During this process, however, he also discovered that he could use an Arduino board and began building the functionality for this.

Meanwhile, the back-end member began building the map interface.  Due to the scope of the project, it was decided to use Google static maps in combination with Distance Matrix, autocomplete and paths.  These four APIs were tied together on the server-side and then rendered in a React component which would then be styled by the front end member.  The map interface is where we determined locations, distances, times and other variables for later use in database and trip checker functions.

The front-end member finished the Auth-0 implementation and began work on the main interface which would combine several React components which would connect to our server including: battery, lights button, trip check/start/end button, rpm tachometer, speed tachometer, trip check status, power level slider and distance matrix.


PHASE 3) Completion

The second week and completion of the app was characterized by overcoming literally every possible hardware issue.  Once we realized we needed to use Arduino, the next challenge was implementing a WIFI shield to allow connectivity.  We purchased the ESP8266 shield, began implementing, but then after exhaustive tests realized that we were missing the logic converter for the motor and would not have time to implement this.  We then had to switch to the CC3000 shield which required us to solder our own pins.  Eventually we got this working, only to discover that for security purposes, we could not connect to the Arduino through existing Wifi networks, but that we would need to create our own LAN.

It was a mere day before our presentation when we were finally able to establish a
throughput between the hardware, the network, the server and the user interface.  It was only at this point that we were able to begin testing all of the functions that we had built, and time was slim.  With a lot of grind we were able to fully implement the following functions, a few of which were finished the morning of the presentation:

- Lights: on/off button
- Rpm: Live tachometer
- Speed: Live tachometer
- Power Level Slider: Set power level on board (user sees percent, function sends pulse to Arduino > motor)

- Trip Button: 
 1. 'New Trip': renders the map interface
 2. Map interface shows static map with current position.  User types in destination with autocomplete.
 3. Distance matrix for distance and time estimate based on bicycle.
 4. Static map displays results and encoded path from Google path function.
 5. Clicking forward brings all data to main interface components.
 6. Becomes "Check" button, which brings all data to hardware and runs the Trip Checker function, which warns user if they have enough power to finish trip based on current settings, time and distance.
 7. Becomes "Start Trip" button, which begins recording variables for database.
 8. Becomes "End Trip" button, which pushes all pertinent data to database.

- Trip matrix: shows destination name, time elapsed and estimated time based on distance matrix while in trip mode.


#Challenges & Limitations

Although we have a working application, we are limited by our hardware and aim to implement a better system in the future.  The main issue is that the Arduino board has a very limited capacity to handle requests for data.  The way our application is designed, the React user interface is sending GET requests for data such as rpm at quick, continuous intervals.  The delicate Arduino server can crash frequently when too many requests come through, such as lights, power level and rpm requests at the same time.  This would have not been an issue with the Particle cloud, so we hope to be able to implement the project with that hardware once we solve the pulse wave issue.  Using the particle would also solve the problem of having to use our own secure LAN for communication to the Arduino.
