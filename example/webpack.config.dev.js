var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',
  // Add webpack-hot-middleware/client to our bundle so our universal subscribes to update notifications from the server
  entry: ['webpack-hot-middleware/client', path.join(__dirname, 'src/client/index')],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',

    // Add a publicPath property. This is the path referenced in the script tag in our html template to our bundle.js.
    // We need this to configure webpack-dev-middleware in server.js
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        query: {
          // Ripped from: https://github.com/gaearon/babel-plugin-react-transform
          plugins: [
            ["react-transform", {
              "transforms": [{
                "transform": "react-transform-hmr",
                "imports": ["react"],
                "locals": ["module"]
              }, {
                // you can have many transforms, not just one
                "transform": "react-transform-catch-errors",
                "imports": ["react", "redbox-react"]
              }]
            }]
          ]
        }
      }]
  },

  // Enables hot module replacement in webpack
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};