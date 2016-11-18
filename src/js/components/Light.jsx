var React = require('react');


var falightBulb = require('react-icons/lib/fa/lightbulb-o');

var Light = React.createClass({
    getInitialState: function(){
      return {
          lightOn: false
      }  
    },
    handleChange: function(){
        return (
            this.setState({
                lightOn: !this.state.lightOn
            })
            )
    },
    render: function(){
      if(this.state.lightOn === true){
    return (
        <div>
            
            <div className="lightBulb" onClick={this.handleChange}>
                <div>{React.createElement(falightBulb, null)}</div>
            </div>
            <span>{this.props.children}</span>
        </div>
        )
      }
      else{
          return (
        <div>
            
            <div className="lightBulb1" onClick={this.handleChange}>
                <div>{React.createElement(falightBulb, null)}</div>
            </div>
            <span>{this.props.children}</span>
        </div>
        )
          
      }
    }
})

module.exports = Light
