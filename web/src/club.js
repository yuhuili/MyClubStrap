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

      db.ref('/activities/' + clubId).on('value', function(snapshot) {
        renderActivity(snapshot);
      });
    }
  });

  $('#sign-out').click(function() { firebase.auth().signOut(); })

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

  var counter = 0;
  for (var key in clubData.clubMembers) {
    if (clubData.clubMembers.hasOwnProperty(key)) {
      counter++;
    }
  }

  var adminUid = undefined;
  for (key in clubData.clubAdmins) {
    if (clubData.clubAdmins.hasOwnProperty(key)) {
      adminUid = key;
      break;
    }
  }

  if (adminUid) {
    // Get the admin's name
    db.ref('/users/' + adminUid).once('value', function(adminSnap) {
      var adminData = adminSnap.val();

      $('#club-admin-name').html(adminData.public.firstName + ' ' + adminData.public.lastName);
    });
  }

  $('#num-members').html(counter + ' Members');

  if (!rendered) {
    rendered = true;
    $('#loading').addClass('hidden');
    $('#app-content-div').removeClass('hidden');
  }

}

/*

 <div class="row">
 <div class="event">
 <div class="club-row"><span class="title">Hack the North 2016</span><a href="#" class="show-map" style="width:20px;height:20px; display:inline-block; margin-left:10px; background-image:url('/img/marker.png'); background-size:contain; background-position:left top; background-repeat:no-repeat; cursor:pointer" data-lat="43.472975" data-lng="-80.540050" data-zoom="17" data-title="Hack the North 2016"></a></div>
 <div class="club-row"><span class="date">September 16-18, 2016</span><span class="location pull-right">Engineering 5 at University of Waterloo</span></div>
 <div class="club-row"><span class="event-field">We're having a hacking session at E5 fam get over here! Bro like you don't even get it this is gonna be so fucking lit G.</span></div>
 </div>
 </div>


 */

function renderActivity(snap) {
  var activities = snap.val();

  var domString = '<h3>Events</h3><hr>';
  for (var key in activities) {
    if (activities.hasOwnProperty(key)) {
      var activityData = activities[key];

      domString += '<div class="row" style="margin-left: 0px;margin-right: 0px;">';
      domString += '<div class="event">';
      domString += '<div class="club-row"><span class="title">' + activityData.name + '</span></div>';
      domString += '<div class="club-row"><span class="date">' + activityData.date + '</span><span class="location pull-right">' + activityData.location + '</span></div>';
      domString += '<div class="club-row"><span class="event-field">' + activityData.longDesc + '</span></div>';
      domString += '</div>';
      domString += '</div>';

    }

  }

  $('#event-list').html(domString);

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

    db.ref('/clubs/' + clubId + '/clubMembers/' + user.uid).once('value', function(snap) {
      if (snap.val() === true) {
        // The user is a member / admin
        $('.btn-join-club').addClass('hidden');
        db.ref('/clubs/' + clubId + '/clubAdmins/' + user.uid).once('value', function(snapshot) {
          if (snapshot.val() === true) {
            // This user is an admin
            $('#warning-box').removeClass('hidden');
            $('#warning-box span').html('<a class="btn btn-success" href="/approve.html?clubId=' + clubId + '">Approve New Registration Requests</a>');
          }
        });
      } else {
        db.ref('/requests').orderByChild('uid').equalTo(user.uid).on('child_added', function(snap) {
          $('.btn-join-club').addClass('hidden');
          $('#warning-box').removeClass('hidden');
          $('.text-warning').html("Your request to join this club is pending.");
        });
        $('.btn-join-club').removeClass('hidden');
      }
    });

    // Render User in the navbar
    // Fetch the user's profile information once
    db.ref('/users/' + user.uid + '/public').once('value')
      .then(function(snapshot) {
        // Set the profile link to "Welcome " + firstName
        $('#profile-link').children('span').html('Welcome ' + snapshot.val().firstName);

        $('#profile-link').parent().removeClass('hidden');
        $('#sign-out').parent().removeClass('hidden');
      });
  } else {
    $('#profile-link').addClass('hidden');
    $('#sign-out').addClass('hidden');
    $('#sign-in-reg').removeClass('hidden');
    $('.btn-join-club').addClass('hidden');
  }
});

function joinClub() {
  if (firebaseUser) {

    clubId = parse('clubId');

    db.ref('/requests/').push({
      uid: firebaseUser.uid,
      clubId: clubId,
      status: 'new'
    });

    $('#warning-box').removeClass('hidden');
    $('.text-warning').html("Thank you for submitting a request to join this club! You'll receive a reply shortly.");

  } else {
    $('#warning-box').removeClass('hidden');
    $('.text-warning').html('You must sign in / register to join a club.')
  }
}