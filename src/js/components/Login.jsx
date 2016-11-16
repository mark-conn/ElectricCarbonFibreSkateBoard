var React = require('react');
import Auth0Lock from 'auth0-lock-passwordless';
import Home from './Home';



var Login = React.createClass({
   componentWillMount: function() {
    this.lock = new Auth0Lock('jTRUEM5AjOkCtC4uEyhAHaxho0WRjkoT', 'efc-skateboard.auth0.com');
    },
    render: function() {
        return (
            <div className="main-login">
                    <Home lock={this.lock}/>
            </div>
            
        );
    }
});

module.exports = Login;