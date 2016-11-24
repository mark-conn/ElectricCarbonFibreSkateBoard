var React = require('react');
var logo_img = require('../../../static/logo.jpg');


var Home = React.createClass({
  // ...
  showLock: function() {
    // Show the Auth0Lock widget
    var options = {
 connections: ["facebook", "google-oauth2"],
 icon: logo_img,
 closable: false,
 dict: {title: ""},
 focusInput: false,
 gravatar: false,
 callbackURL: "https://ecf-board-kitchdev.c9users.io/homepage" 
}
    this.props.lock.social(options);
  },


  render: function() {
    return (
    <div className="front">
      <span className="frontTitle">Welcome to ECF SkateBoard Controller</span>  
      <div className="login-box">
        <button className ="login-button">
          <a className="login" onClick={this.showLock}>Sign In</a>
        </button>
      </div>
    </div>
    );
  }
});


module.exports = Home;