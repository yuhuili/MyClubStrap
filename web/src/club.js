/**
 * Created by Yuhui (Alexander) Li on 2016-09-17
 */
var $;
global.jQuery = $ = require('jquery');

global.bootstrap = require('bootstrap');

var firebase = require('./init/firebase');

var db = firebase.database();

$(document).ready(function() {
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

  var clubId = parse('clubId');

  db.ref('/clubs/' + clubId)
    .on('value', function(snap) {
      renderSnapshot(snap);
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