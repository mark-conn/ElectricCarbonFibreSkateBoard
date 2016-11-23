import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import axios from 'axios';

var Check = require('./Check')
var Light = require('./Light')
var Speed = require('./Speed')
var Rpm = require('./Rpm')
var TripButton = require('./TripButton')
var TimeLeft = require('./TimeLeft')

var Horizontal = React.createClass({
  getInitialState: function() {
    return (
    this.state = {
      value: 0, /** Start value **/
      tripStarted: false
      }
    )
  },
  _handleChangeState: function(event){
    console.log("this function has triggered")
    this.setState({
      tripStarted: !this.state.tripStarted
    })
  },
  handleChange: function(value) {
    
    this.setState({
      value: value
    }, () => {
      
    axios.get(`/powerlevel/${value}`)
    .then(function(result){
      console.log(result.data);
    });
      
    });
  },
  
  render() {
    console.log(this.state.tripStarted)
    let { value } = this.state;
    console.log(this.props)
    return (
      
      
      <div className="uiLayout">

        <div className="topDisp">
          <div className="checkContainer">
            <span className="smallDesc">Status</span>
            <Check/>
          </div>
          <div className="bulbCon">
            <Light/>
          </div>
          <div  className= "tripContainer">
            <TripButton data={this.props.location.query} onClick={this._handleChangeState} tripStarted={this.state.tripStarted}/>
          </div>
        </div>
        
        <div className="bottomDisp">
        
          <Rpm/>
          <Speed/>
        </div>
        <div className='horizontal-slider'>
          <div className='sliderDiv'>
            <h4 className="numbers">Power Level: {value}</h4>
            <Slider
              min={0}
              max={100}
              value={value}
              onChange={this.handleChange}
            />
          </div>
        {/*  <div className='value'>Value: {value}</div> */}
        </div>
        <span className="destLoc">Destination selected: <br/>{this.props.location.query.destination}</span>
        <div className="tripTimer">
        {this.state.tripStarted ? <TimeLeft duration={this.props.location.query.duration}/> : null}
        </div>
      </div>
    );
  }
})


module.exports = Horizontal;