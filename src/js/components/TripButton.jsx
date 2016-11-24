var React = require('react');
var history = require('react-router').browserHistory;
var axios = require('axios');
var Map = require('./Map');
var Check = require('./Check');
var maps = require('react-icons/lib/io/ios-navigate')
var load = require('react-icons/lib/io/wrench')
var start = require('react-icons/lib/fa/play-circle-o')
var done = require('react-icons/lib/fa/flag-checkered')

var newTrip = React.createElement(maps, null)
var check = React.createElement(load, null)
var tripStart = React.createElement(start, null)
var endTrip = React.createElement(done, null)



var TripButton = React.createClass ({
    
    propTypes: {
      
      changeCheckStatus: React.PropTypes.func,
        
    },

    getInitialState: function() {
        return {
            
            buttondisplay: newTrip,
            newtripClicked: false,
            checkTrip: false,
            checkTripReading: null,
            tripStarted: false,
            tripEnded: false,
            currentlocation: null,
            destination: null,
            distance: null,
            duration: null
            

        };
    },
    
    componentDidMount: function() {
    
        if(this.props.data.currentlocation) {
            this.setState({
                buttondisplay: check,
                currentlocation: this.props.data.currentlocation,
                destination: this.props.data.destination,
                distance: this.props.data.distance,
                duration: this.props.data.duration
            });
        } 
    },
    
    _buttonClick: function() {
        
        if(this.state.buttondisplay === newTrip) {
           this.setState({
               newtripClicked: true
           }, () => {
               
                history.push(`/map`);  
           });
           
        }else if(this.state.buttondisplay === check) {

           axios.get(`/checktrip/${this.state.currentlocation}/${this.state.distance}/${this.state.duration}`)
           .then((result) => {
               
               this.props.changeCheckStatus(result.data);
               this.setState({
                   checkTripReading: result.data,
                   buttondisplay: tripStart
               });
               
               
           });
            
        }
         else if(this.state.buttondisplay === tripStart) {
            this.setState({
                tripStarted: true
            }, () => {
                
                axios.get(`/starttrip/${this.state.currentlocation}`)
                .then( (result) => {
                    this.setState({
                        buttondisplay: endTrip
                    });
                    this.props.onClick();
                });
            });
        }
         else if(this.state.buttondisplay === endTrip) {
             this.props.changeCheckStatus(null);
            this.setState({
                tripEnded: true,
                buttondisplay: newTrip
            });
            this.props.onClick();
         }
        
    },
    
    render: function() {
        if(this.state.buttondisplay === tripStart)
        return (
            <div className="mapButton1">
                <span className="smallDesc">Start</span>
                <button onClick={this._buttonClick}>{this.state.buttondisplay}</button>
            </div>
        )
        else if(this.state.buttondisplay === endTrip){
        return (
            <div className="mapButton2">
                <span className="smallDesc">End</span>
                <button onClick={this._buttonClick}>{this.state.buttondisplay}</button>
            </div>
            )
        }
            else if(this.state.buttondisplay === check){
        return (
            <div className="mapButton3">
                <span className="smallDesc">Check</span>
                <button onClick={this._buttonClick}>{this.state.buttondisplay}</button>
            </div>
            )
        }
        else{
        return (
            <div className="mapButton">
                <span className="smallDesc">New Trip</span>
                <button onClick={this._buttonClick}>{this.state.buttondisplay}</button>
            </div>
            )            
        }
        
    }
    
});

module.exports = TripButton;