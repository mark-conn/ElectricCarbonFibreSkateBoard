COMPONENTS FOR MAIN INTERFACE
*BOARD*: gets and/or changes variables from Board
*INTERNAL*: gets and or changes variables from Internal (Database/Map API)
*#*: Does not yet have API or Express construction


1) Battery --> *BOARD*
Route: /batterylevel
Display: <icons> (depicting battery level)
AJAX call every 'minute'
Icons changed depending on received battery percent variable
Changes state, re-renders


2) Distance Left --> *INTERNAL* *#*
Route: /distanceleft
Display: <p>NUMBER KMs<p>
AJAX call every 'minute'
Number changed depending on distanceleft variable received
Changes state, re-renders


3) Check --> *BOARD* *#*
Route: /check
Display: <icons> (Depicting green light, yellow light or red light)
AJAX call every 'minute'
Icons changed depending on check variable received
Changes state, re-renders


4) Stats --> *INTERNAL* *#*
Route: /stats
Display: renders a new interface with graphs queried from database


5) Time Left --> *INTERNAL* *#*
Route: /timeleft
Display: <p>NUMBER IN MINUTES</p>
AJAX call every 'minute'
Number changes depending on timeleft variable received
Changes state, re-renders


6) New Trip/Start Trip/End Trip --> *BOARD/INTERNAL* *#*

    WHEN NEW TRIP
    Route: /newtrip
    Display: button
    On Click: renders the Map Interface 
    
    
    WHEN START TRIP
    Route: /starttrip
    Params: /:currentlocation
    Display: button
    On Click: triggers the start trip function
    Changes state to END TRIP, re-renders
    
    
    WHEN END TRIP
    Route: /endtrip
    Display: button
    On Click: triggers the end trip function
    Changes state to NEW TRIP, re-renders


7) RPM
Route: /rpm
Display: <p>RPM NUMBER</p>
AJAX call every '30 seconds'
RPM NUMBER changed depending on rpm variable received
Changes state, re-renders


8) Lights
Route: /lights
Params: /:toggle
Display: <icons> (Depicting a light bulb on(colored) or off(light grey))
Button: on click --> AJAX call to toggle lights
Changes state, re-renders


9) Power Level
Route: /powerlevel
Params: /:percent
Display: <slider> (With knob ranging from 0 to 100%)
Pseudo-Button: on click --> AJAX call to set power level
Changes state, re-renders

10) Speed