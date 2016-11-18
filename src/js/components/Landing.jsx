var React = require('react');
import axios from 'axios';

var Landing = React.createClass({
        getInitialState(){
        return {}  
    },
        componentDidMount(){
        var that = this;

        axios.get(`https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap
&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318
&markers=color:red%7Clabel:C%7C40.718217,-73.998284
&key=AIzaSyBlKIW646n_Y_uU815DjCfBKQSZ3c_cTTw`)
      .then(function(response) {
                console.log(response)
                that.setState({
                  posts: response
                })
      });

    },
    
  render(){
    return (
        <div>
            {this.state.posts}
        </div>
        )    
    }
})



module.exports = Landing