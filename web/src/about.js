/**
 * Created by edwardson on 2016-09-17.
 */
var $;
global.jQuery = $ = require('jquery');

global.bootstrap = require('bootstrap');

var firebase = require('./init/firebase');
var navbar = require('./init/navbar');

navbar(firebase);
