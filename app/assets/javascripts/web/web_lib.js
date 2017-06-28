//= require jquery3
//= require jquery_ujs
//= require underscore
//= require sweetalert

var $j = jQuery.noConflict();

function check_download() {
  $j( "#query_form" ).css("display","none");
  $j( ".wait_div" ).css("display","");
  var pollDownloadStart = setInterval(function() {
    var X = document.cookie.split(";");
    var i = _.indexOf(X," download_start=true");
    if(i > -1) {
        document.cookie = "download_start=false;";
        var i = _.indexOf(X," download_start=true");
        $j( ".wait_div" ).css("display","none");
        $j( "#query_form" ).css("display","");
        clearInterval(pollDownloadStart);
    }
  }, 1000);
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
