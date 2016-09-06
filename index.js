var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var turf = require('turf');
var $ = require ('jquery');
var GeoJSON = require('geojson');
var _ = require ('lodash');
var mapboxgl = require('mapbox-gl');

function transformDataset(dataset) {
	if (dataset !== undefined || dataset !== null)
	{
		var transformedDataset = dataset.feed.entry.map(function(entry){
			var contentString = entry.content.$t;
			var contentFields = contentString.split(',');
			var content = {};
			contentFields.forEach(function(field) {
				var fieldParts = field.split(':')
				content[fieldParts[0].trim()] = fieldParts[1].trim();
				content.latitude = Number.parseFloat(content.latitude);
				content.longitude = Number.parseFloat(content.longitude);

			})

			return content;
		});
		return transformedDataset;
	}
	return transformedDataset;
}


const ALL = 'all';
var partnersObj = [
{"name": "UNICEF"},
{"name": "BRiCS"},
{"name": "NRC"},
{"name": "WFP"},
{"name": "BRiCS_CESVI"},
{"name": "FAO"},
{"name": "SNS"}];

var categoriesObj = [
{"name": "Nutrition & Health"},
{"name": "Cash Transfers"},
{"name": "Livelihoods"},
{"name": "Midline"},
{"name": "Quarterly Monitoring"},
{"name": "Nutritional Casual Analysis Verification"},
{"name": "WASH Monitoring"},
{"name": "Education Monitoring"},
{"name": "Nutrition & Health Monitoring"},
{"name": "Protection Monitoring"}];

var typesObj = [
{"name": "CC"},
{"name": "FS"}];

var PartnerFilter= React.createClass({
	getPartners: function() {
		var partners = [];
		for (var i = 0; i < partnersObj.length; i++) {
			partners.push(partnersObj[i].name);
		}
		this.setState({partners: partners});
	},
	componentDidMount: function() {
		this.getPartners();
	},
	getInitialState: function() {
		return {
			partners: []
		};
	},
	_getOptions: function() {
		var options = [],
		partners = this.state.partners;

		options.push((
			<li key={ 0 }>
			<a href="#" data-value={ 'all' } onClick={ this.onChange }>Implementing Partner</a>
			</li>
			));

		for (let i = 0; i < partners.length; i++) {
			var partner = partners[i],
			y = i + 1;
			options.push((
				<li key={ partner }>
				<a href="#" data-value={ partner } onClick={ this.onChange }>{ partner }</a>
				</li>
				));
		}

		return options;
	},
	onChange: function(e) {
		e.preventDefault();
		var partner = e.target.dataset.value.toLowerCase(),
		partnerLabel = partner.toUpperCase();
		if(partner === ALL) {
			partner = null;
			partnerLabel = ALL;
		}

		this.setState({currentPartner: partnerLabel });
		if(this.props.onChange !== undefined) {
			this.props.onChange(partner);
		}
	},
	render: function() {
		var options = this._getOptions();
		return (
			<div className="dropdown col-md-3" id="partner-filter">
			<button className="btn btn-default dropdown-toggle filter-active" type="button" data-toggle="dropdown" aria-expanded="false">
			<span className="data-label">{ this.state.currentPartner !== undefined && this.state.currentPartner !== ALL ? this.state.currentPartner : "Implementing Partner"} </span>
			<i className="fa fa-chevron-down"></i>
			</button>
			<ul className="dropdown-menu" role="menu">
			{ options }
			</ul>
			</div>    );
		}
	});


	var CategoryFilter= React.createClass({
		getCategories: function() {
			var categories = [];
			for (var i = 0; i < categoriesObj.length; i++) {
				categories.push(categoriesObj[i].name);
			}
			this.setState({categories: categories});
		},
		componentDidMount: function() {
			this.getCategories();
		},
		getInitialState: function() {
			return {
				categories: []
			};
		},
		_getOptions: function() {
			var options = [],
			categories = this.state.categories;

			options.push((
			<li key={ 0 }>
			<a href="#" data-value={ 'all' } onClick={ this.onChange }> Category </a>
			</li>
			));

			for (let i = 0; i < categories.length; i++) {
				var category = categories[i],
				y = i + 1;
				options.push((
				<li key={ category }>
				<a href="#" data-value={ category } onClick={ this.onChange }>{ category }</a>
				</li>
				));
			}

			return options;
		},
		onChange: function(e) {
			e.preventDefault();
			var category = e.target.dataset.value.toLowerCase(),
			categoryLabel = category.toUpperCase();
			if(category === ALL) {
				category = null;
				categoryLabel = ALL;
			}

			this.setState({currentCategory: categoryLabel });
			if(this.props.onChange !== undefined) {
				this.props.onChange(category);
			}
		},
		render: function() {
			var options = this._getOptions();
			return (
			<div className="dropdown col-md-3" id="category-filter">
			<button className="btn btn-default dropdown-toggle filter-active" type="button" data-toggle="dropdown" aria-expanded="false">
			<span className="data-label">{ this.state.currentCategory !== undefined && this.state.currentCategory !== ALL ? this.state.currentCategory : "Category"} </span>
			<i className="fa fa-chevron-down"></i>
			</button>
			<ul className="dropdown-menu" role="menu">
			{ options }
			</ul>
			</div>    );
		}
	});


	var TypeFilter= React.createClass({
		getTypes: function() {
			var types = [];
			for (var i = 0; i < typesObj.length; i++) {
				types.push(typesObj[i].name);
			}
			this.setState({types: types});
		},
		componentDidMount: function() {
			this.getTypes();
		},
		getInitialState: function() {
			return {
				types: []
			};
		},
		_getOptions: function() {
			var options = [],
			types = this.state.types;

			options.push((
			<li key={ 0 }>
			<a href="#" data-value={ 'all' } onClick={ this.onChange }> TPM Type </a>
			</li>
			));

			for (let i = 0; i < types.length; i++) {
				var type = types[i],
				y = i + 1;
				options.push((
				<li key={ type }>
				<a href="#" data-value={ type } onClick={ this.onChange }>{ type }</a>
				</li>
				));
			}

			return options;
		},
		onChange: function(e) {
			e.preventDefault();
			var type = e.target.dataset.value.toLowerCase(),
			typeLabel = type.toUpperCase();
			if(type === ALL) {
				type = null;
				typeLabel = ALL;
			}

			this.setState({currentType: typeLabel });
			if(this.props.onChange !== undefined) {
				this.props.onChange(type);
			}
		},
		render: function() {
			var options = this._getOptions();
			return (
			<div className="dropdown col-md-3" id="type-filter">
			<button className="btn btn-default dropdown-toggle filter-active" type="button" data-toggle="dropdown" aria-expanded="false">
			<span className="data-label">{ this.state.currentType !== undefined && this.state.currentType !== ALL ? this.state.currentType : "TPM Type"} </span>
			<i className="fa fa-chevron-down"></i>
			</button>
			<ul className="dropdown-menu" role="menu">
			{ options }
			</ul>
			</div>    );
		}
	});



	var Header = React.createClass({
		render: function()
		{
			return (
			<h1 className="heading col-md-3"> MESH TPM Activities </h1>
			)
		}
	});

	var MapWidget = React.createClass({
		getInitialState: function() {		
			return {token: this.props.token,
				currentPartner: this.props.currentPartner,
				data: this.props.data}
			},
			mapFunctions: function(map)
			{
				var aggregations = [{
					aggregation: 'count',
					inField: '',
					outField: 'point_count'
				}];

				var somhexbin_url = 'https://raw.githubusercontent.com/onaio/turf-experiments/gh-pages/data/sombuf-hex25.geojson';

				if (this.state.data !== undefined)
				{
					GeoJSON.parse(this.state.data, {Point: ['latitude', 'longitude']}, function(geojson) {
						locations = geojson;
					});

				}
				else
				{
					locations = [];
				}
				d3.json(somhexbin_url, function(error, bufhex) {
					//console.log(JSON.stringify(bufhex));

					// This is what needs to work v

					//var cliphexgrid = turf.intersect(bufhex,hexgrid);

					// aggregate is for turf 2.0


					var hexagg = turf.aggregate(bufhex, locations, aggregations);

					// collect is for turf 3.0

					// var hexagg = turf.collect(bufhex,locations,'','point_count');
					//console.log(JSON.stringify(hexagg));

					map.addSource('locations', {
						type: 'geojson',
						data: locations
					});

					var points_layer = map.addLayer({
						'id': 'locations',
						'type': 'circle',
						'source': 'locations',
						'paint': {
							'circle-opacity': 1,
							'circle-color': '#334d4d',
							'circle-radius': 2
						}
					}, 'waterway-label');


					map.addSource('somhex', {
						'type': 'geojson',
						'data': hexagg
					});


					map.addLayer({
						'id': 'route',
						'type': 'fill',
						'source': 'somhex',
						layout: {
							visibility: 'visible'
						},
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
				});
				this.setState({map: map})
			},
			getMap: function()
			{
				mapboxgl.accessToken = this.state.token;
				var map = new mapboxgl.Map({container: 'app',
				style: 'mapbox://styles/mapbox/streets-v9',
				center: [44, 3], // starting position
				zoom: 5.5 // starting zoom
			});

			this.setState({map: map});
			this.mapFunctions(map);

		},

		handleFilters: function()
		{
			this.setState({map: []});
		},
		removeSourcesAndLayers: function(map)
		{
			map.removeSource('locations');
			map.removeLayer('locations');
			map.removeSource('somhex');
			map.removeLayer('route');
		},
		componentDidMount: function() {

			//this.getMap();
		},

		componentDidUpdate: function(prevProp, prevState)
		{
			if(!_.isEqual(prevProp.data, this.props.data)) {
				var map = this.state.map;
				if(this.state.map !== undefined) {
					this.removeSourcesAndLayers(map);
					this.mapFunctions(map);
				}
				else
				{
					this.getMap();
				}
			} 
		},
		componentWillReceiveProps: function(nextProps)
		{
			if (nextProps.currentPartner !== undefined && nextProps.currentPartner !== null)
			{
				this.setState({currentPartner: nextProps.currentPartner});
			}
			if (nextProps.data !== undefined && nextProps.data !== null)
			{
				this.setState({data: nextProps.data});
			}
		},

		render: function() {
			return (
			<div id="map">
			</div>

			);
		}
	});

	var Dashboard = React.createClass({

		getInitialState: function() {
			return {currentPartner: this.props.partner !== undefined ? this.props.partner : null,
				currentCategory: this.props.category !== undefined ? this.props.category : null,
				currentType: this.props.type !== undefined ? this.props.type : null};
			},
			_handleFilters: function(data, kwargs) {
				var localstorageData = JSON.parse(localStorage.getItem('data'));
				if(kwargs) {
					category = kwargs.category;
					partner = kwargs.partner;
					type = kwargs.type;
				}
				else
				{
					partner = this.state.currentPartner;
					category = this.state.currentCategory;
					type = this.state.currentType;
				}

				if ((partner === null || partner === undefined) && (category === undefined || category === null) && (type === undefined || type === null))
				{
					filtereddata = localstorageData;
				}
				else if ((partner !== undefined || partner !== null) && (category === undefined || category === null)
					&& (type === undefined || type === null))
				{
					filtereddata = localstorageData.filter(function (dataset) {
						return dataset.ip.toLowerCase() == partner;
					});
				}
				else if(category !== undefined && partner === undefined && type === undefined)
				{
					filtereddata = localstorageData.filter(function (dataset)
					{
						return dataset.category.toLowerCase() == category;
					});
				}

				else if (type !== undefined && category === undefined && partner === undefined )

				{
					filtereddata = localstorageData.filter(function (dataset)
					{
						return dataset.tpmtype.toLowerCase() == type;
					});

				}

				else
				{
					filtereddata = localstorageData;
				}
				var cc = filtereddata.filter(function (dataset)
				{
					return dataset.tpmtype.toLowerCase() == 'cc';
				});
				var fs = filtereddata.filter(function (dataset)
				{
					return dataset.tpmtype.toLowerCase() == 'fs';
				});
				this.setState({data: filtereddata});
				this.setState({cc: cc.length});
				this.setState({fs: fs.length});
			},

			getData: function()
			{
				this.serverRequest = $.getJSON("https://spreadsheets.google.com/feeds/list/1x3riTR0U7Hzdmp09wytjBen8Jh6cEPWYNYHI673n6o4/1/public/basic?alt=json", function (tpm_data) {
					var transformedDataset = transformDataset(tpm_data);
					transformedDataset = transformedDataset.filter(function(val){
						return !isNaN(val.longitude) && !isNaN(val.latitude)})
						this.setState({
							data: transformedDataset

						});
						localStorage.setItem('data', JSON.stringify(transformedDataset));
					}.bind(this));
				},

				setPartner: function(_partner) {
					if (this.state.currentPartner !== _partner) {
						this.setState({currentPartner: _partner});
						this._handleFilters(this.state.data, {partner: _partner});
					}
				},
				setCategory: function(_category) {
					if (this.state.currentCategory !== _category) {
						this.setState({currentCategory: _category});
						this._handleFilters(this.state.data, {category: _category});
					}
				},
				setType: function(_type) {
					if (this.state.currentType !== _type) {
						this.setState({currentType: _type});
						this._handleFilters(this.state.data, {type: _type});
					}
				},
				componentDidMount: function ()
				{
					// var data = this.getData();
					// this.setState({data: data});

				},

				componentWillMount: function ()
				{
					this.getData();
				},

				render: function() {
					var token = 'pk.eyJ1Ijoib25hIiwiYSI6IlVYbkdyclkifQ.0Bz-QOOXZZK01dq4MuMImQ';
					return (

					<div className="container fluid">
					<div id="header">
					<Header />
					<PartnerFilter onChange={ this.setPartner } />
					<CategoryFilter onChange={ this.setCategory } />
					<TypeFilter onChange= {this.setType} />
					</div>

					<div>
					<MapWidget token='pk.eyJ1Ijoib25hIiwiYSI6IlVYbkdyclkifQ.0Bz-QOOXZZK01dq4MuMImQ'
					currentPartner={this.state.currentPartner} data= {this.state.data}/>
					</div>


					</div>)
				}
			});


			ReactDOM.render(<Dashboard /> ,
			document.getElementById('app'));