/**
 * Created by gabriel on 9/13/16.
 */

var path = require('path');
var webpack = require('webpack');

function getConfig(debug) {
  return {
    context: __dirname,
    entry: './web/src/main.js',
    devtool: debug ? 'inline-source-map' : null,
    output: {
      path: path.join(__dirname, 'build/src'),
      filename: 'bundle.js'
    },
    plugins: debug ? null : [
      new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]
  };
}

module.exports = getConfig(true);

module.exports.getWithDebugFlag = function(debug) {
    return getConfig(debug);
};
