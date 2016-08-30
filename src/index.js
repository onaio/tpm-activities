var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var turf = require('turf');

var MapWidget = React.createClass({
  getInitialState: function() {
 //    var mapboxgl = require('mapbox-gl');
 //    	mapboxgl.accessToken = this.props.token;
   
	// var map = new mapboxgl.Map({
	//     container: 'app',
	//     style: 'mapbox://styles/mapbox/streets-v9',
 //        center: [44, 3], // starting position
 //        zoom: 5.5 // starting zoom
	// });
  return {}
  },
  getMap: function(map)
  {

  },

  handleFilters: function()
  {
  	this.setState({map: []});
  },

  componentDidMount: function() {
  var mapboxgl = require('mapbox-gl');
  mapboxgl.accessToken = this.props.token;
  var map = new mapboxgl.Map({container: 'app',
							 style: 'mapbox://styles/mapbox/streets-v9',
						     center: [44, 3], // starting position
						     zoom: 5.5 // starting zoom
						});

	this.setState({map})

	var aggregations = [{
		aggregation: 'count',
		inField: '',
		outField: 'point_count'
	}];

	var tpm_url = 'https://raw.githubusercontent.com/onaio/turf-experiments/gh-pages/data/unicef-cash.geojson';
	var somhexbin_url = 'https://raw.githubusercontent.com/onaio/turf-experiments/gh-pages/data/sombuf-hex25.geojson';

	d3.json(tpm_url, function(error, tpm_data) {
		d3.json(somhexbin_url, function(error, bufhex) {
	            //console.log(JSON.stringify(bufhex));

	            // This is what needs to work v

	            //var cliphexgrid = turf.intersect(bufhex,hexgrid);

	            // aggregate is for turf 2.0

            var hexagg = turf.aggregate(bufhex, tpm_data, aggregations);

            // collect is for turf 3.0

            // var hexagg = turf.collect(bufhex,tpm_data,'','point_count');
            //console.log(JSON.stringify(hexagg));


            map.addSource('tpm_data', {
            	type: 'geojson',
            	data: tpm_data
            });

            var points_layer = map.addLayer({
            	'id': 'tpm_data',
            	'type': 'circle',
            	'source': 'tpm_data',
            	'paint': {
            		'circle-opacity': 1,
            		'circle-color': '#334d4d',
            		'circle-radius': 2
            	}
            }, 'waterway-label');

            map.on('load', function() {
            	map.addSource('somhex', {
            		'type': 'geojson',
            		'data': hexagg
            	});


            	map.addLayer({
            		'id': 'route',
            		'type': 'fill',
            		'source': 'somhex',
            		'paint': {
            			'fill-outline-color': '#ccc',
            			'fill-color': {
            				property: 'point_count',
            				stops: [
            				[0, 'transparent'],
            				[1, '#eff3ff'],
            				[100, '#08519c']
                                ] // #f00

                            },
                            'fill-opacity': 0.7
                        }
                    }, 'waterway-label');




            });

            map.on('click', function (e) {
            	var features = map.queryRenderedFeatures(e.point, { layers: ['route'] });
            	if (!features.length) {
            		return;
            	}

            	var feature = features[0];

            	var popup = new mapboxgl.Popup()
            	.setLngLat(map.unproject(e.point))
            	.setHTML(feature.properties.point_count + " TPM Activities")
            	.addTo(map);
            });

            // Use the same approach as above to indicate that the symbols are clickable
            // by changing the cursor style to 'pointer'.
            map.on('mousemove', function (e) {
            	var features = map.queryRenderedFeatures(e.point, { layers: ['route'] });
            	map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
            });
	        });
	});

 
  },
  componentWillUnmount: function() {
    
  },
  render: function() {
  	var { map } = this.state;
  	return (
  		<div>
  		<div id="header">
  		<h1 className="heading"> MESH TPM Activities </h1>
  		<select name="ip" className="ip-dropdown">
  		<option> Implementing Partner </option>
  		<option> UNICEF </option>
  		<option> BRiCS </option>
  		<option> NRC </option>
  		<option> WFP </option>
  		<option> BRiCS_CESVI</option>
  		<option> FAO </option>
  		<option> SNS </option>
  		</select>

  		<select name="category" className="category-dropdown">
  		<option value="category" selected> Category </option>
  		<option> Nutrition & Health  </option>
  		<option> Cash Transfers </option>
  		<option> Livelihoods </option>
  		<option> Midline </option>
  		<option> Quarterly Monitoring </option>
  		<option> Nutritional Casual Analysis Verification </option>
  		<option> WASH Monitoring </option>
  		<option> Education Monitoring  </option>
  		<option> Nutrition & Health Monitoring </option>
  		<option> Protection Monitoring </option>
  		</select>

  		<select name="tpm_type" className="tpm-type-dropdown">
  		<option value="tpm_type"> TPM Type </option>
  		<option value="cc"> CC </option>
  		<option value="fs"> FS </option>
  		</select>
  		</div>
  		<div> { map } </div>
  		</div>
    );
  }
});

ReactDOM.render(<MapWidget token='pk.eyJ1Ijoib25hIiwiYSI6IlVYbkdyclkifQ.0Bz-QOOXZZK01dq4MuMImQ' /> ,
						   document.getElementById('app'));