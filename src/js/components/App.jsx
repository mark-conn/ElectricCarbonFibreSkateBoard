var React = require('react');
var Link = require('react-router').Link;
import Auth0Lock from 'auth0-lock-passwordless';
import Home from './Home';


/*
This is the layout component. It's displayed by the top-level Route
this.props.children will correspond to the current URL's component.

If the URL is only / then the IndexRoute's component will be the child (Search component)
If the URL is /user/:username then the User component will be displayed.
*/
var App = React.createClass({

    render: function() {
        return (
            <div className="main-app">
                <header className="main-header">
                    <h1><Link to="/">ECF Board</Link></h1>
                    <img src="./logo.jpg"/>
                </header>
                <main className="main-content">
                    {this.props.children}
                </main>
            </div>
                
        );
    }
});

module.exports = App;