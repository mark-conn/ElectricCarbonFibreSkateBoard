var React = require('react')
    
import axios from 'axios';

var clock = require('react-icons/lib/fa/clock-o');




var TimeLeft = React.createClass({
    getInitialState: function(){
      return {
        seconds: 0,
        minutes: 0,
        hours: 0
      }
    },

    tick: function() {
    this.setState({seconds: this.state.seconds + 1});
    if (this.state.seconds <= 0) {
      clearInterval(this.interval);
    }
    else if(this.state.seconds === 60){
        this.setState({
            seconds: 0,
            minutes: this.state.minutes + 1
        })
    }
    else if(this.state.minutes === 60){
        this.setState({
            minutes: 0,
            hours: this.state.hours + 1
            
        })
    }
  },
  componentDidMount: function() {
    this.setState({ secondsRemaining: this.props.duration });
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
    render: function(){
        console.log("My second length is" , this.state.seconds.toString().length > 1 ? this.state.seconds : "0" + this.state.seconds)
        return (
            <div className="timeBox">
                <div className= "TimeLeft numbers1">Trip Duration:<br/>{this.props.duration} </div>
                <div className="counter">
                   {React.createElement(clock, null)} <br/>
                    <span className="numbers1">{this.state.hours.toString().length > 1 ? this.state.hours : "0" + this.state.hours }:
                    {this.state.minutes.toString().length > 1 ? this.state.minutes : "0" + this.state.minutes }:
                    {this.state.seconds.toString().length > 1 ? this.state.seconds : "0" + this.state.seconds }</span>
                </div>
            </div>
                )
        // else if(this.state.seconds > 60){
        //         console.log("My min length is", this.state.minutes.toString().length > 1 ? this.state.minutes : "0" + this.state.minutes)
        //     return (
        //         <ul className= "TimeLeft">Trip Duration: {this.props.duration}
        //             <li>00:{this.state.minutes.toString().length > 1 ? this.state.minutes : "0" + this.state.minutes}:
        //             {this.state.seconds.toString().length > 1 ? this.state.seconds : "0" + this.state.seconds }</li>
        //         </ul>
        //         )
        //     }
        }

    
});




module.exports = TimeLeft