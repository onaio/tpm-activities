const webpack = require('webpack');
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/index.html',
  filename: 'index.html',
  inject: 'body'
});
module.exports = {
  entry: [
    './index.js'
  ],
  resolve: {
     alias: {
            'webworkify': 'webworkify-webpack'
        },
    extensions: ["", ".js", ".jsx"]
  },
  module: 
  {
  	loaders: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'},
    {
      test: /\.jsx$/,
      loader: 'react-hot'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.js$/,
      include: path.resolve('node_modules/mapbox-gl-shaders/index.js'),
      loader: 'transform/cacheable?brfs'
    }],
    postLoaders: [{
      include: /node_modules\/mapbox-gl-shaders/,
      loader: 'transform',
      query: 'brfs'
    }]
  },
  output: {
   path: __dirname,
   filename: "dist/js/bundle.js"
  },
  plugins: [HTMLWebpackPluginConfig]
}