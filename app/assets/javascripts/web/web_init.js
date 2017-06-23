
$j(document).ready(function(){

  document.cookie = "download_start=false;"; 
  $j( "#query_form" ).submit(function( event ) {
    check_download(); 
  });

});
