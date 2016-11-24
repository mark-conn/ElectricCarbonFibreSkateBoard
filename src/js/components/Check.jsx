var React = require("react");
var Horizontal = require('./Horizontal');
import axios from 'axios';


/* this component is meant to check the general status of the boards internal functions, 
whether it's hardwear, server or app - depicting a GREEN YELLOW OR RED circle. */
var check = require('react-icons/lib/fa/check');
var warning = require('react-icons/lib/fa/exclamation-triangle');
var problem = require('react-icons/lib/fa/thumbs-o-down')



var Check = React.createClass({
    
    
    getInitialState: function(){
      return {
          sysStatus: this.props.myProps
      };
    },


    
    render: function(){
        console.log("here in check", this.props.myProps);
        
        
        if(!this.props.myProps) { return (
        <div>
            <div  className="warnLights">
               <div className="checkCircle0">
                   {React.createElement(check, null)}
                </div>
            </div>
        </div> 
            )
        }
        
        else if(this.props.myProps === "green"){
            return (
            <div  className="warnLights">
               <div className="checkCircleG">
                   {React.createElement(check, null)}
                </div>
            </div>
                )
        }
        else if(this.props.myProps === "yellow"){
            return (
                <div className="warnLights">
                    <div className="checkCircleY">
                        {React.createElement(warning, null)}
                    </div>
                </div>
                )
        }        
        else if(this.props.myProps === "red"){
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