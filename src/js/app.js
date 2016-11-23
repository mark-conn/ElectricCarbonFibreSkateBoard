var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
const Auth0Lock = require('auth0-lock-passwordless').default;

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var Login = require('./components/Login');
var Home = require('./components/Home'); //more of a landing/ sign in page
var Map = require('./components/Map');
var Horizontal = require('./components/Horizontal'); //homepage
var Light = require('./components/Light');
var Check = require('./components/Check');
var App = require('./components/App');



/*
Rendering a router will output the right component tree based on the current URL.
Nested routes' components will be passed down to the parent as `this.props.children`

If the URL is /, then <App/> will be rendered, and this.props.children will be <Search/> (this is the IndexRoute)
If the URL is /user/ziad-saab then <App/> will be rendered, and this.props.children will be <User/>
The <User/> instance will be passed a prop called `params`. It will be an object with `{username: 'ziad-saab'}`
*/
var routes = (
    
    <Router history={ReactRouter.browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Login}>
            <Route path="/" component={Home}/>
            </IndexRoute>
            <Route path="homepage" component={Horizontal}/>
            <Route path="map" component={Map}/>
        </Route>
    </Router>
);



ReactDOM.render(routes, document.getElementById('app'));