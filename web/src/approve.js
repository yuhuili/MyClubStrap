/**
 * Created by gabriel on 9/18/16.
 */

var $ = global.jQuery = require('jquery');

var bootstrap = require('bootstrap');

var firebase = require('./init/firebase');
var db = firebase.database();

var navbar = require('./init/navbar');

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

var clubId = parse('clubId');

navbar(firebase);

function newRequest(request, requestId) {

  db.ref('/users/' + request.uid).once('value', function(userSnap) {
    var user = userSnap.val();

    var domString = '<tr>';
    domString += '<td>' + user.public.firstName + ' ' + user.public.lastName + '</td>';
    domString += '<td>' + user.private.schoolEmail + '</td>';
    domString += '<td><a class="btn btn-success">Approve</a><a class="btn btn-danger">Decline</a></td>';
    domString += '<tr>';

    $('#request-table').append(domString);

    $('.btn-success:last').click(function() {
      db.ref('/requests/' + requestId + '/status').set('approved');
      db.ref('/clubs/' + clubId + '/clubMembers/' + request.uid).set(true);
    });
    $('.btn-danger:last').click(function() {
      db.ref('/requests/' + requestId + '/status').set('declined');
    });

  });

}

firebase.auth().onAuthStateChanged(function (user) {
  if (user && user.emailVerified) {

    db.ref('/clubs/' + clubId + '/clubAdmins/' + user.uid).once('value', function(snapshot) {
      if (snapshot.val()) {

        db.ref('/requests').on('value', function(snap) {
          var requests = snap.val();

          $('#request-table').html('');
          for (var requestId in requests) {
            if (requests.hasOwnProperty(requestId)) {
              var req = requests[requestId];
              if (req.clubId === clubId && req.status === 'new') newRequest(req, requestId);
            }
          }
        });

      } else {
        window.location.replace('/');
      }
    });

  } else {
    window.location.replace('/LoginPage.html');
  }
});