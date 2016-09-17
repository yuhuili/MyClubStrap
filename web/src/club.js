/**
 * Created by Yuhui (Alexander) Li on 2016-09-17
 */
var $;
global.jQuery = $ = require('jquery');

global.bootstrap = require('bootstrap');

$(document).ready(function() {
  $(".show-map").click(function(e) {
    $("#mapModal .modal-title").html($(this).data("title"));
    $("#mapModal").modal();
    mapLat = $(this).data("lat");
    mapLng = $(this).data("lng");
    mapZoom = $(this).data("zoom");
    mapTitle = $(this).data("title");
    
    if (mapLoaded==true) {
      initMap();
    }
    
    return false;
  });
});