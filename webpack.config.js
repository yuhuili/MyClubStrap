/**
 * Created by gabriel on 9/13/16.
 */

var path = require('path');
var webpack = require('webpack');

// To add a new entry point just add another to this list

var entryPoints = ['./web/src/main.js','./web/src/login.js','./web/src/directory.js','./web/src/club.js]';




function getEntry() {
  var entry = {};
  for (var i = 0; i < entryPoints.length; i++) {
    var name = path.basename(entryPoints[i], '.js');
    entry[name] = entryPoints[i];
  }
  return entry;
}

function getConfig(debug) {
  return {
    context: __dirname,
    entry: getEntry(),
    devtool: debug ? 'inline-source-map' : null,
    output: {
      path: path.join(__dirname, 'build/src'),
      filename: '[name].js'
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
