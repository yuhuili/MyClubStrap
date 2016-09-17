/**
 * Created by edwardson on 2016-09-17.
 */
var $;
global.jQuery = $ = require('jquery');

global.bootstrap = require('bootstrap');


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

  });

  $('#register-submit').click(function() {
      const email = $('#reg-email').val();
      const password = $('#reg-password').val();
      const displayName = $('#reg-display-name').val();

  });

});