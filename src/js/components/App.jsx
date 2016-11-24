var React = require('react');
var Link = require('react-router').Link;
import Auth0Lock from 'auth0-lock-passwordless';
import Home from './Home';
import axios from 'axios';

var FaBat4 = require('react-icons/lib/fa/battery-4');
var FaBat3 = require('react-icons/lib/fa/battery-3');
var FaBat2 = require('react-icons/lib/fa/battery-2');
var FaBat1 = require('react-icons/lib/fa/battery-1');
var FaBat0 = require('react-icons/lib/fa/battery-0');

var logo_img = require('../../../static/logo.jpg');
/*
This is the layout component. It's displayed by the top-level Route
this.props.children will correspond to the current URL's component.

If the URL is only / then the IndexRoute's component will be the child (Search component)
If the URL is /user/:username then the User component will be displayed.
*/
var App = React.createClass({
        getInitialState: function(){
        return {
            battPow: 87
            }
        },
    // componentDidMount: function() {

    //         setInterval(() => {
                
    //         axios.get(`/batterylevel`)
    //         .then((result) =>{
                
    //             this.setState ({
    //                 battPow: result.data
    //             });
    //         })
    //         ,600000 });
    // },

    render: function() {
    if(this.state.battPow <= 100 && this.state.battPow > 90){    
        return (
            <div className="main-app">
                <header className="main-header">
                    <Link to={`/homepage`}><img className="logo" src={logo_img}/></Link>
                    <div className="batPer"> 
                        {React.createElement(FaBat4, null)}
                        <p className="Perc">{this.state.battPow}%</p>
                    </div>
                </header>
                <main className="main-content">
                    {this.props.children}
                </main>
            </div>
                
        );
    }
    else if(this.state.battPow <= 90 && this.state.battPow >50){
         return (
            <div className="main-app">
                <header className="main-header">
                    <Link to={`/homepage`}><img className="logo" src={logo_img}/></Link>
                    <div className="batPer">
                        {React.createElement(FaBat3, null)}
                        <p className="Perc">{this.state.battPow}%</p>
                    </div>
                </header>
                <main className="main-content">
                    {this.props.children}
                </main>
            </div>
                
            );
        }
        else if(this.state.battPow <= 50 && this.state.battPow >25){
          return (
            <div className="main-app">
                <header className="main-header">
                    <Link to={`/homepage`}><img className="logo" src={logo_img}/></Link>
                    <div  className="batPer">
                        {React.createElement(FaBat2, null)}
                        <p className="Perc">{this.state.battPow}%</p>
                    </div>
                </header>
                <main className="main-content">
                    {this.props.children}
                </main>
            </div>
                
            );
        }
        else if(this.state.battPow <= 25 && this.state.battPow >5){
          return (
            <div className="main-app">
                <header className="main-header">
                    <Link to={`/homepage`}><img className="logo" src={logo_img}/></Link>
                    <div className="batPer">
                        {React.createElement(FaBat1, null)}
                        <p className="Perc">{this.state.battPow}%</p>
                    </div>
                </header>
                <main className="main-content">
                    {this.props.children}
                </main>
            </div>
                
            );
        }
        else {
                    return (
            <div className="main-app">
                <header className="main-header">
                    <Link to={`/homepage`}><img className="logo" src={logo_img}/></Link>
                    <div className="batPer">
                        {React.createElement(FaBat0, null)}
                        <p className="Perc">{this.state.battPow}%</p>
                    </div>
                </header>
                <main className="main-content">
                    {this.props.children}
                </main>
            </div>
                
        );
        }
    }
});

module.exports = App;