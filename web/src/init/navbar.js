/**
 * Created by gabriel on 9/18/16.
 */

var $ = require('jquery');

module.exports = function(firebase) {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user && user.emailVerified) {
      // Render User in the navbar
      // Fetch the user's profile information once
      firebase.database().ref('/users/' + user.uid + '/public').once('value')
        .then(function (snapshot) {
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
};
