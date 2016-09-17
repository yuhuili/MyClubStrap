
// Sets up jQuery and Bootstrap
var $ = require('jquery');
global.jQuery = $;

var bootstrap = require('bootstrap');

var firebase = require('./init/firebase');

$(function() {
  $('#sign-out').click(function() {
    firebase.auth().signOut();
  })
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user && user.emailVerified) {
    // Render User in the navbar
    // Fetch the user's profile information once
    firebase.database().ref('/users/' + user.uid + '/public').once('value')
      .then(function(snapshot) {
        // Set the profile link to "Welcome " + firstName
        $('#profile-link').children('span').html('Welcome ' + snapshot.val().firstName);

        $('#profile-link').parents().removeClass('hidden');
        $('#sign-out').parents().removeClass('hidden');
        $('#sign-in-reg').addClass('hidden');
      });
  } else {
    $('#profile-link').addClass('hidden');
    $('#sign-out').addClass('hidden');
    $('#sign-in-reg').removeClass('hidden');
  }
});