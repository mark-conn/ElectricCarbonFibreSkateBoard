var React = require('react');



var Home = React.createClass({
  // ...
  showLock: function() {
    // Show the Auth0Lock widget
    var options = {
 connections: ["facebook", "google-oauth2"],
 icon: "/path/to/my/icon.png",
 closable: false,
 dict: {title: "EFC Board"},
 focusInput: false,
 gravatar: false,
 callbackURL: "https://ecf-board-kitchdev.c9users.io/homepage"
}
    this.props.lock.social(options);
  },


  render: function() {
    return (
    <div className="login-box">
      <button className ="login-button">
        <a className="login" onClick={this.showLock}>Sign In</a>
      </button>
    </div>);
  }
});


module.exports = Home;