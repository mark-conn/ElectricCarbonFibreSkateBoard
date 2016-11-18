var React = require('react');
var axios = require('axios');


var Map = React.createClass({
    
    getInitialState: function() {
      return {
          loading: false,
          display: null
      };  
        
    },

    componentDidMount: function() {
        var that = this;
        
        window.navigator.geolocation.getCurrentPosition(function(position){
            that.currentLat = position.coords.latitude;
            that.currentLon = position.coords.longitude;
            
            axios.get(`getstaticmap/${that.currentLat},${that.currentLon}`)
            .then(function(result){
                that.setState ({
                    display: result.data
                });
            });
        });

    },
    
    // setDestination: function() {
    //     function getDistanceMatrix() {
    //         axios.get(`/getdistancematrix/${that.currentLat},${that.currentLon}`)
    //             .then(function(result) {
    //                 var distanceMatrix = {distance: result.data.distance.text, duration: result.data.duration.text};
    //                 return distanceMatrix;
    //             });
    //         }
    //         function getStaticMap() {
    //         axios.get(`/getstaticmap`)    
                
    //         }
    // },
    
    render: function() {
        console.log(this.state.display)
        return (
            <div className="map">
                <img src={this.state.display}/>
                <p>There should be a map here</p>
            </div>
            )
    }
    
    
});


module.exports = Map;