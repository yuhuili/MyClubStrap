/**
 * Created by edwardson on 2016-09-17.
 */
// Sets up jQuery and Bootstrap
var $ = require('jquery');
global.jQuery = $;

var bootstrap = require('bootstrap');

var firebase = require('./init/firebase');

/*
 <div class="media">
 <div class="media-left media-top">
 <a href="#">
 <img class="img-circle" src="/img/health.jpg" alt="...">
 </a>
 </div>
 <div class="media-body">
 <h4 class="media-heading"> Healthcare of Tomorrow</h4>
 <span>UW Healthcare of Tomorrow is a club that wishes to gather anyone interested in healthcare, or is interested in pursuing a career in health care . We strive to connect students with health care professionals by facilitating guest speaker events, and promoting the...</span>
 <a class="btn btn-default" href="#" role="button">Learn More</a>
 </div>
 </div>
 */

$(function() {
  $('#sign-out').click(function() {
    firebase.auth().signOut();
  });

  $('#view-all-clubs').click(function() {
    window.location.replace('/Directory.html');
  });
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

var clubsRef = firebase.database().ref('/clubs').on('value', function(snap) {
  renderList(snap.val());
});

function renderBlock(club, clubId) {
  var block = '<div class="media">';
  block += '<div class="media-left media-top">';

  var link = '/clubs.html?clubId=' + clubId;
  var clubInfo = club;

  block += '<a href="' + link + '">';
  block += '<img class="img-circle" src="' + clubInfo.thumbnail + '" alt="thumbnail">';
  block += '</a>';
  block += '</div>';
  block += '<div class="media-body">';
  block += '<h4 class="media-heading">' + clubInfo.clubName + '</h4>';
  block += '<span>' + clubInfo.shortDesc + '</span>';
  block += '<a class="btn btn-default" href="' + link + '">Learn More</a>';
  block += '</div>';
  block += '</div>';

  return block;

}

function renderList(clubs) {

  var domString = '';
  for (var clubId in clubs) {
    if (clubs.hasOwnProperty(clubId)) {
      domString += renderBlock(clubs[clubId], clubId);
    }
  }

  $('#club-list').html(domString);

}