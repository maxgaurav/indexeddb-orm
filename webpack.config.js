const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: './dist/es2015/index.js',
  output: {
    filename: './idb.js',
  },
  optimization: {
    minimize: true
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
      },
    }]
  },
  devtool: "source-map"
};
