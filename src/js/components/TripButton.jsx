var React = require('react');
var history = require('react-router').browserHistory;
var axios = require('axios');
var Map = require('./Map');

var TripButton = React.createClass ({
    
    getInitialState: function() {
        return {
            
            buttondisplay: "New Trip",
            newtripClicked: false,
            checkTrip: false,
            checkTripReading: null,
            tripStarted: false,
            

        };
    },
    
    componentDidMount: function() {
        console.log(this.props.location)
                if(this.props.location.query.destination) {
            this.setState({
                newtripClicked: true,
            });
            
        }
        if(this.state.newtripClicked) {
            this.setState({
                buttondisplay: "Check"
            });
        } 
    },
    
    _buttonClick: function() {
        
        if(this.state.buttondisplay === "New Trip") {
           this.setState({
               newtripClicked: true
           }, () => {
               
                history.push(`/map`);  
           });
           
        } else if(this.state.buttondisplay === "Check") {
           
           axios.get(`/checktrip/${this.props.currentlocation.query}/${this.props.distance.query}/${this.props.duration.query}`)
           .then((result) => {
               
               this.setState({
                   checkTripReading: result.data,
                   buttondisplay: "Start Trip"
               });
               
               
           });
            
        }
          else if(this.state.buttondisplay === "Start Trip") {
            this.setState({
                tripStarted: true
            }, () => {
                
                axios.get(`/starttrip/${this.props.currentlocation.query}`)
                .then( (result) => {
                    this.setState({
                        buttondisplay: "End Trip"
                    });
                });
            });
        }
        
    },
    
    render: function() {
        return (
        <div className="mapButton">
            <button onClick={this._buttonClick}>{this.state.buttondisplay}</button>
        </div>
        )
        
    }
    
});

module.exports = TripButton;