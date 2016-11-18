var React = require("react");

import axios from 'axios';


/* this component is meant to check the general status of the boards internal functions, 
whether it's hardwear, server or app - depicting a GREEN YELLOW OR RED circle. */


var Check = React.createClass({
    getInitialState: function(){
      return {
          sysStatus: "green"
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
                    PERFECT
                </div>
            </div>
                )
        }
        else if(this.state.sysStatus === "yellow"){
            return (
                <div className="warnLights">
                    <div className="checkCircleY">
                        WARNING
                    </div>
                </div>
                )
        }        
        else if(this.state.sysStatus === "red"){
            return (
                <div className="warnLights">
                    <div className="checkCircleR">
                        ALERT!
                    </div>
                </div>
                )
        }
    }
});



module.exports = Check;