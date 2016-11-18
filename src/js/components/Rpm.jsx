var React = require('react');

import axios from 'axios';

var Revs = React.createClass({
    getInitialState: function(){
      return {
        Rpm  : 1500
      }
    },
            // componentDidMount: function() {
    //     var that = this;
    //         setInterval(function(){
    //         axios.get(`/speed`)
    //         .then(function(result){
    //             that.setState ({
    //                 Rpm: result.data
    //             });
    //         })
    //         ,10000 });
    // },
    render: function(){
        return (
            <div className= "tachometer">
                <span>Rpm: {this.state.Rpm} </span>
            </div>
        )
    }
    
});




module.exports = Revs;