//= require jquery3
//= require jquery_ujs
//= require underscore

var $j = jQuery.noConflict();

function check_download() {
  $j( "#query_form" ).css("display","none");
  var pollDownloadStart = setInterval(function() {
    var X = document.cookie.split(";");
    var i = _.indexOf(X," download_start=true");
    if(i > -1) {
        document.cookie = "download_start=false;";
        $j( "#query_form" ).css("display","");
        clearInterval(pollDownloadStart);
    }
  }, 1000);
}
