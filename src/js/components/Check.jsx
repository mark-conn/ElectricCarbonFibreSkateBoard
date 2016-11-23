var React = require("react");

import axios from 'axios';


/* this component is meant to check the general status of the boards internal functions, 
whether it's hardwear, server or app - depicting a GREEN YELLOW OR RED circle. */
var check = require('react-icons/lib/fa/check');
var warning = require('react-icons/lib/fa/exclamation-triangle');
var problem = require('react-icons/lib/fa/thumbs-o-down')



var Check = React.createClass({
    getInitialState: function(){
      return {
          sysStatus: "red"
      }
    },
        // componentDidMount: function() {
    //     var that = this;
    //         setInterval(function(){
    //         axios.get(`/check`)
    //         .then(function(result){
    //             that.setState ({
    //                 sysStatus: result.data
    //             });
    //         })
    //         ,10000 });
    // },
    
    render: function(){
        if(this.state.sysStatus === "green"){
            return (
            <div  className="warnLights">
               <div className="checkCircleG">
                   {React.createElement(check, null)}
                </div>
            </div>
                )
        }
        else if(this.state.sysStatus === "yellow"){
            return (
                <div className="warnLights">
                    <div className="checkCircleY">
                        {React.createElement(warning, null)}
                    </div>
                </div>
                )
        }        
        else if(this.state.sysStatus === "red"){
            return (
                    <div className="warnLights">
                        <div className="checkCircleR">
                            {React.createElement(problem, null)}
                        </div>
                    </div>
                )
        }
    }
});



module.exports = Check;