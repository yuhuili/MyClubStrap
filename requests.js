/**
 * Created by gabriel on 9/18/16.
 */

var firebase = require('./web/src/init/firebase');

var sendGridKey = require('./bin/sendgridInit');
var sendGrid = require('sendgrid')(sendGridKey);
var helper = require('sendgrid').mail;

var db = firebase.database();

const from = 'clubify@sendgrid.com';

db.ref('requests')
  .on('child_added', function(snapshot) {
    handleSnapshot(snapshot);
  });

function handleSnapshot(snapshot) {
  var request = snapshot.val();

  request.requestId = snapshot.getKey();

  if (request.status === 'new') {

    // Send mail to admins
    resolveAdmins(request, function(admins) {

      resolveUser(request, function(user) {

        finalizeStatusNew(request, admins, user);

      });

    });

  }

}

function resolveAdmins(request, callback) {

  db.ref('/clubs/' + request.clubId + '/clubAdmins/').once('value', function(snapshot) {
    var clubAdminsNode = snapshot.val();

    var len = 0;
    for (var uid in clubAdminsNode) {
      if (clubAdminsNode.hasOwnProperty(uid))
        len++;
    }

    var clubAdmins = [];
    for (uid in clubAdminsNode) {
      if (clubAdminsNode.hasOwnProperty(uid)) {

        db.ref('/users/' + uid).once('value', function(userSnap) {
          var userNode = userSnap.val();

          clubAdmins.push({
            email: userNode.private.preferredEmail == '' ?
              userNode.private.schoolEmail : userNode.private.preferredEmail,
            fullname: userNode.public.firstName + ' ' + userNode.public.lastName,
          });

          if (clubAdmins.length == len)
            callback(clubAdmins);

        });

      }
    }
  });

}

function resolveUser(request, callback) {

  db.ref('users/' + request.uid).once('value', function(snapshot) {
    var userNode = snapshot.val();

    callback({
      email: userNode.private.preferredEmail == '' ?
        userNode.private.schoolEmail : userNode.private.preferredEmail,
      fullname: userNode.public.firstName + ' ' + userNode.public.lastName
    })

  })

}

function finalizeStatusNew(request, admins, user) {

  db.ref('clubs/' + request.clubId).once('value', function(snapshot) {

    var body = user.fullname + ' has requested to join ' + snapshot.val().clubName + '.';
    body += ' To accept, please confirm at the following link http://localhost:3000/AdminDecision.html?requestId=' + request.requestId;

    var mail = new helper.Mail();
    var email = new helper.Email(from, 'Clubify System');

    var personalization = new helper.Personalization();
    admins.forEach(function(admin) {
      personalization.addTo(new helper.Email(admin.email, admin.fullname));
    });
    mail.addPersonalization(personalization);

    var content = new helper.Content('text/plain', body);
    mail.addContent(content);

    mail.setFrom(email);
    mail.setSubject('Hello World from the SendGrid Node.js Library');

    var sgRequest = sendGrid.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });

    db.ref('requests/' + request.requestId + '/status')
      .set('pending');

  });

}