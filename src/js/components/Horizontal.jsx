import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import axios from 'axios';

var Check = require('./Check')
var Light = require('./Light')
var Speed = require('./Speed')
var Rpm = require('./Rpm')

var Horizontal = React.createClass({
  getInitialState: function() {
    return (
    this.state = {
      value: 0 /** Start value **/
      }
    )
  },
  
  handleChange: function(value) {
    this.setState({
      value: value
    });
  },

  render() {
    let { value } = this.state;
    return (
      <div className="uiLayout">
        <Light/>
        <div className="bottomDisp">
          <Speed/>
          <Rpm/>
          <Check/>
        </div>
        <div className='horizontal-slider'>
          <div className='sliderDiv'>
            <h4>Power Level</h4>
            <Slider
              min={0}
              max={100}
              value={value}
              onChange={this.handleChange}
            />
          </div>
          <div className='value'>Value: {value}</div>
        </div>
      </div>
    );
  }
})


module.exports = Horizontal;