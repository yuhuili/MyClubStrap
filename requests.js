/**
 * Created by gabriel on 9/18/16.
 */

var firebase = require('./web/src/init/firebase');
var nodemailer = require('nodemailer');

var db = firebase.database();

var transporter = nodemailer.createTransport('smtps://alacchi.g%40gmail.com:pass@smtp.gmail.com');

var from = 'Clubify System: <alacchi.g@gmail.com>';

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

    var mailList = admins.map(function(admin) { return admin.email; }).join(',');

    var mailOptions = {
      from: from,
      to: mailList,
      subject: 'New club join request from ' + user.fullname,
      text: body
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        return;
      }

      console.log('Message sent: ' + info.response);

      db.ref('requests/' + request.id + '/status')
        .set('pending');

    });

  });

}