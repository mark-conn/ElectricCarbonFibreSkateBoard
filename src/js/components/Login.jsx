var React = require('react');
import Auth0Lock from 'auth0-lock-passwordless';
import Home from './Home';



var Login = React.createClass({
    
   componentWillMount: function() {
    var options = {
     additionalSignUpFields: [{
       name: "address",
       placeholder: "enter your address",
       // The following properties are optional
       icon: "https://example.com/assests/address_icon.png",
       prefill: "street 123",
       validator: function(address) {
         return {
            valid: address.length >= 10,
            hint: "Must have 10 or more chars" // optional
         };
       }
     },
    {
   name: "full_name",
   placeholder: "Enter your full name"
 }]
}

    this.lock = new Auth0Lock('jTRUEM5AjOkCtC4uEyhAHaxho0WRjkoT', 'efc-skateboard.auth0.com');
    },
    render: function() {
        return (
            <div className="main-login">oooppppuio
                    <Home lock={this.lock}/>
            </div>
            
        );
    }
});

module.exports = Login;