// DISTANCE MATRIX REQUEST
// use navigator.geolocation
// http://html5doctor.com/finding-your-position-with-geolocation/
        


`https://maps.googleapis.com/maps/api/distancematrix/json?
origins=${request.params.currentlocation}
&destinations=${request.params.tripdestination}
&mode=bicycling
&language=en
&avoid=highways
&key=AIzaSyAizOC5hi8Wwkxshx-0sb0TE--2VV5zKIQ`


//STATIC MAP REQUEST
/*
Normally, you need to specify center and zoom URL parameters to define 
the location and zoom level of your generated map. However, if you supply 
markers, path, or visible parameters, you can instead let the Google 
Static Maps API determine the correct center and zoom level implicitly, 
based on evaluation of the position of these elements.
*/

// in order to encode an ADDRESS for the request, we can use encodeURIComponent
// example: 
// encodeURIComponent("4455, coloniale, montreal");
// "4455%2C%20coloniale%2C%20montreal"


`https://maps.googleapis.com/maps/api/staticmap?
center=${request.params.currentlocation}
&zoom=14
&size=500x400
&scale=2
&maptype=roadmap
&path=color:0x0000ff80%7Cweight:2`
    