var React = require('react');

import axios from 'axios';

var Revs = React.createClass({
    getInitialState: function(){
      return {
        Rpm: 0
      }
    },
    // componentDidMount: function() {
        
    //     setInterval(() => {
    //         axios.get(`/rpm`)
    //         .then((result) => {
    //             this.setState ({
    //                 Rpm: result.data
    //             });
    //         })
    //         ,1000 });
    // },
    render: function(){
        return (
            <div className= "tachometer">
                <span className="numbers">Rpm<br/> {this.state.Rpm} </span>
            </div>
        )
    }
    
});




module.exports = Revs;