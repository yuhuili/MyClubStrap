/**
 * Created by gabriel on 9/17/16.
 */

var $ = global.jQuery = require('jquery');

var bootstrap = require('bootstrap');

var firebase = require('./init/firebase');

var navbar = require('./init/navbar');
navbar(firebase);

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

  firebase.database().ref('/users/' + user.uid).once('value', function(snapshot) {
    var userVal = snapshot.val();
    var private = user.private;
    var public = user.public;

    $('#user-fullname').html(userVal.public.firstName + ' ' + userVal.public.lastName);

    var domString = '';
    firebase.database().ref('/clubs').orderByChild('clubMembers').on('child_added', function(club) {
      var clubVal = club.val();

      if (clubVal.clubMembers[user.uid] || clubVal.clubAdmins[user.uid]) {
        domString += '<tr>';
        domString += '<td><a href="/club.html?clubId=' + club.getKey() + '">' + clubVal.clubName + '</a></td>';
        domString += '</tr>'
      }

      $('#profile-table').html(domString);
      pageLoaded();
    });

  })


}

var rendered = false;
function pageLoaded() {
  if (!rendered) {
    $('#app-content-div').removeClass('hidden');
    $('#loading').addClass('hidden');
    rendered = true;
  }
}