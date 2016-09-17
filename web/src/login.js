/**
 * Created by edwardson on 2016-09-17.
 */
var $;
global.jQuery = $ = require('jquery');

global.bootstrap = require('bootstrap');

var firebase = require('./init/firebase');

var db = firebase.database();

firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    $('#verify-email-panel').addClass('hidden');
    $('#login-panel').removeClass('hidden');
  }
  if (!user.emailVerified) {
    $('#verify-email-panel').toggleClass('hidden');
    $('#login-panel').toggleClass('hidden');
  } else {
    window.location.replace('/');
  }
});

$(function() {

  $('#login-form-link').click(function(e) {
    $("#login-form").delay(100).fadeIn(100);
    $("#register-form").fadeOut(100);
    $('#register-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });
  $('#register-form-link').click(function(e) {
    $("#register-form").delay(100).fadeIn(100);
    $("#login-form").fadeOut(100);
    $('#login-form-link').removeClass('active');
    $(this).addClass('active');
    e.preventDefault();
  });

  $('#login-submit').click(function() {
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        $('#login-tip').html(error.message);
      });

  });

  $('#register-submit').click(function() {
    const email = $('#reg-school-email').val();
    const password = $('#reg-password').val();
    const confirmPass = $('#reg-confirm-password').val();
    const prefEmail = $('#reg-pref-email').val();

    const firstName = $('#reg-first-name').val();
    const lastName = $('#reg-last-name').val();

    var regTip = $('#register-tip');
    regTip.html('');

    if (email.trim() == '') {
      regTip.html('Please provide your school email before registering.');
      return;
    }

    if (firstName.trim() == '' || lastName.trim() == '') {
      regTip.html('Please provide your full name');
      return;
    }

    if (password != confirmPass) {
      regTip.html("The two passwords don't match.");
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        regTip.html(error.message);
      })
      .then(function(user) {
        db.ref('/users/' + user.uid + '/private').set({
          preferredEmail: prefEmail,
          schoolEmail: email
        });
        db.ref('/users/' + user.uid + '/public').set({
          clubs: null,
          firstName: firstName.trim(),
          lastName: lastName.trim()
        });
        regTip.html('A verification email has been sent to your school email!');
        user.sendEmailVerification();
      });

  });

  $('#sign-out').click(function() {
    firebase.auth().signOut();
  });

});