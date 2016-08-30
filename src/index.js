var React = require('react');
var ReactDOM = require('react-dom');

var MapWidget = React.createClass({
  getInitialState: function() {
    var mapboxgl = require('mapbox-gl');
    	mapboxgl.accessToken = this.props.token;
   
	var map = new mapboxgl.Map({
	    container: 'app',
	    style: 'mapbox://styles/mapbox/streets-v9',
        center: [44, 3], // starting position
        zoom: 5.5 // starting zoom
	});
  return {data: map}
  },
  handleFilters: function()
  {
  	this.setState({map: []});
  },

  componentDidMount: function() {
 
  },
  componentWillUnmount: function() {
    
  },
  render: function() {
    return (
      <div> { this.state.data } </div>
    );
  }
});

ReactDOM.render(<MapWidget token='pk.eyJ1Ijoib25hIiwiYSI6IlVYbkdyclkifQ.0Bz-QOOXZZK01dq4MuMImQ' /> ,
						   document.getElementById('app'));