var React = require('react');
var axios = require('axios');
var history = require('react-router').browserHistory;


var Map = React.createClass({
    
    getInitialState: function() {
      return {
          loading: false,
          display: null,
          currentLat: null,
          currentLon: null,
          destination: null,
          suggestionArray: [],
          distanceMatrix: {distance: null, duration: null}
      };  
        
    },

    componentDidMount: function() {
        var that = this;
        
        window.navigator.geolocation.getCurrentPosition(function(position){
            that.currentLat = position.coords.latitude;
            that.currentLon = position.coords.longitude;
            
            axios.get(`/getfirstmap/${that.currentLat},${that.currentLon}`)
            .then(function(result){
                that.setState ({
                    display: result.data,
                    currentLat: that.currentLat,
                    currentLon: that.currentLon
                });
            });
        });
    },
    
    getAutocomplete: function() {
        var that = this;
        var dest = this.refs.destinationInput.value;
        console.log(dest);
        if(dest.length > 1) {
            axios.get(`/auto-complete/${this.state.currentLat},${this.state.currentLon}/${dest}`).then(function(result){
              that.setState({
                  suggestionArray: result.data
              });
             
            });
        }
    },
    
    setDestination: function(item) {
      var that = this;    
      this.setState({
          destination: encodeURIComponent(item)
      }, () => {
          
        axios.get(`/path/${this.state.currentLat},${this.state.currentLon}/${this.state.destination}`)
        .then(function(result){
            that.setState({
                path: result.data
            }, () => {
               that.getResultMap(); 
            });
        });
      });
      
        
    },
    
    getResultMap: function() {
        var that = this;
        
        function getDistanceMatrix() {
            return axios.get(`/getdistancematrix/${that.state.currentLat},${that.state.currentLon}/${that.state.destination}`);
            }
        
        function getStaticMap() {
            var url = `/getresultmap/${that.state.currentLat},${that.state.currentLon}/${that.state.destination}/${that.state.path}`
            return axios.get(url);    
            }
            
        axios.all([getDistanceMatrix(), getStaticMap()])
        .then(axios.spread(function(matrix, map, directions){
            that.setState({
                display: map.data,
                distanceMatrix: {distance: matrix.data.distance.text, duration: matrix.data.duration.text}
            });
        })); 
    },
    
    _nextButton: function() {
        history.push(`/?currentlocation=${this.state.currentLat},${this.state.currentLon}&destination=${this.state.destination}&distance=${this.state.distanceMatrix.distance}&duration=${this.state.distanceMatrix.duration}`);
    },
    
    _backButton: function() {
      this.setState({
          destination: null
      });  
    },
    
    render: function() {
        
        return (
            <div className="map-container">
                <img className="static-map" src={this.state.display}/>
                {this.state.destination ? 
                <div className="distance-matrix">
                    <p><i className="fa fa-map-marker" aria-hidden="true"></i> {this.state.distanceMatrix.distance}</p>
                    <p><i className="fa fa-clock-o" aria-hidden="true"></i> {this.state.distanceMatrix.duration}</p>
                </div>
                : null}
                {this.state.destination ? null :
                <form onSubmit={this.getResultMap}>
                    <input ref="destinationInput" className="destination-input" type="text" onChange={this.getAutocomplete}/>
                    <button className="destination-button">Search</button>
                </form>}
                
                {this.state.destination ? null : 
                    <ul className="suggestion-list">
                        {this.state.suggestionArray.map(function(item){ 
                        return(
                        <li>
                        <button onClick={()=> this.setDestination(item)}>{item}</button>
                        </li>)}.bind(this))}
                    </ul>}
                    
                {this.state.destination ? 
                    <div className="buttons-div">
                    <button className="next" onClick={this._nextButton}>{decodeURIComponent(this.state.destination)}</button>
                    <button className="back" onClick={this._backButton}><i className="fa fa-undo" aria-hidden="true"></i></button>
                    </div> 
                : null }
            </div>
            );
    }
    
    
});


module.exports = Map;