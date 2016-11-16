var React = require('react');



var Home = React.createClass({
  // ...
  showLock: function() {
    // Show the Auth0Lock widget
    this.props.lock.social({
  connections: ["facebook", "google-oauth2"]
});;
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