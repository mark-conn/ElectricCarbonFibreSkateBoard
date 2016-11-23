var React = require('react');

import axios from 'axios';

var Speed = React.createClass({
    getInitialState: function(){
      return {
          kph: 0
      }
    },
    //  componentDidMount: function() {

    //         setInterval(() => {
    //         axios.get(`/currentspeed`)
    //         .then((result) => {
    //             this.setState ({
    //                 kph: result.data
    //             });
    //         })
    //         , 5000 });
    // },
    render: function(){
        return (
            <div className= "speedometer">
                <span className="numbers">Km/h<br/>{this.state.kph}</span>
            </div>
        )
    }
    
});




module.exports = Speed;