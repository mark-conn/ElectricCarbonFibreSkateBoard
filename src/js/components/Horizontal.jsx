import React, { Component } from 'react';
import Slider from 'react-rangeslider';
import axios from 'axios';

var Horizontal = React.createClass({
  getInitialState: function() {
    return (
    this.state = {
      value: 10 /** Start value **/
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
      <div>
        {this.props.children}
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