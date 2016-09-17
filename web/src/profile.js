/**
 * Created by gabriel on 9/17/16.
 */

var $ = global.jQuery = require('jquery');

var bootstrap = require('bootstrap');

var firebase = require('./init/firebase');

firebase.auth().onAuthStateChanged(function (user) {
  if (user && user.emailVerified) {
    // Render the page
    renderUserProfile(user);
  }
  else {
    // Redirect to login / Verification
    window.location.replace('/LoginPage.html');
  }
});

function renderUserProfile(user) {

}