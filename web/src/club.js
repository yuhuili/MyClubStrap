/**
 * Created by Yuhui (Alexander) Li on 2016-09-17
 */
var $;
global.jQuery = $ = require('jquery');

global.bootstrap = require('bootstrap');

var firebase = require('./init/firebase');

var db = firebase.database();
var clubId = parse('clubId');

$(document).ready(function() {

  db.ref('/clubs/' + clubId).once('value', function(snapshot) {
    if (!snapshot.val()) {

      $('#loading').addClass('hidden');
      $('#page-error').removeClass('hidden');
      $('.text-warning').html("This club doesn't exist.");
      $('#app-content-div').addClass('hidden');

    } else {
      $(".show-map").click(function(e) {
        $("#mapModal .modal-title").html($(this).data("title"));
        $("#mapModal").modal();
        var mapLat = $(this).data("lat");
        var mapLng = $(this).data("lng");
        var mapZoom = $(this).data("zoom");
        var mapTitle = $(this).data("title");

        if (mapLoaded==true) {
          initMap();
        }

        return false;
      });

      $('#join-button').click(function() {
        joinClub();
      });

      var clubId = parse('clubId');

      db.ref('/clubs/' + clubId)
        .on('value', function(snap) {
          renderSnapshot(snap);
        });
    }
  });

});

var rendered = false;

function renderSnapshot(snap) {

  var clubData = snap.val();
  $('#club-name').html(clubData.clubName);
  $('#club-name2').html(clubData.clubName);
  $('#club-short-desc').html(clubData.shortDesc);

  var pageData = clubData.pageData;
  $('#carousel-heading').html(pageData.carouselHeading);
  $('#carousel-text').html(pageData.carouselText);

  $('.image-holder:eq(0)').css('background-image', 'url(' + pageData.background + ')');
  $('.image-holder:eq(1)').css('background-image', 'url(' + pageData.carouselBackground + ')');

  $('#club-long-desc').html(pageData.longDesc);

  if (!rendered) {
    rendered = true;
    $('#loading').addClass('hidden');
    $('#app-content-div').removeClass('hidden');
  }

}

function parse(val) {
  var result = "Not found",
    tmp = [];
  location.search
  //.replace ( "?", "" )
  // this is better, there might be a question mark inside
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

var firebaseUser = null;

firebase.auth().onAuthStateChanged(function(user) {
  if (user && user.emailVerified) {

    firebaseUser = user;

    firebase.database().ref('/clubs/' + clubId + '/clubMembers/' + user.uid).once('value', function(snap) {
      if (snap.val() === true) {
        // The user is a member / admin
        $('.btn-join-club').addClass('hidden');
      } else {
        $('.btn-join-club').removeClass('hidden');
      }
    });

    // Render User in the navbar
    // Fetch the user's profile information once
    firebase.database().ref('/users/' + user.uid + '/public').once('value')
      .then(function(snapshot) {
        // Set the profile link to "Welcome " + firstName
        $('#profile-link').children('span').html('Welcome ' + snapshot.val().firstName);

        $('#profile-link').parent().removeClass('hidden');
        $('#sign-out').parent().removeClass('hidden');
        $('#sign-in-reg').addClass('hidden');
      });
  } else {
    $('#profile-link').addClass('hidden');
    $('#sign-out').addClass('hidden');
    $('#sign-in-reg').removeClass('hidden');
  }
});

function joinClub() {
  if (firebaseUser) {

    firebase.database().ref('/requests/').push({
      uid: firebaseUser.uid,
      clubId: clubId,
      status: 'new'
    });

    $('#warning-box').removeClass('hidden');
    $('#warning-box:first-child').html("Thank you for submitting a request to join this club! You'll receive a reply shortly");

    var clubId = parse('clubId');
  } else {
    $('#warning-box').removeClass('hidden');
    $('#warning-box:first-child').html('You must sign in / register to join a club.')
  }
}