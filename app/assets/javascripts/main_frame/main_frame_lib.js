//= require jquery3
//= require jquery_ujs
//= require sweetalert
//= require underscore
//= require d3

var globals = {};
var $j = jQuery.noConflict();
var structure_viewer;
var pssm_viewer;
var msa_viewr;


function chain_selected(){
  var current_ch = $j("#chain_selector").val();
  structure_viewer.highlight_chain(globals.pdb,current_ch);
  update_pssm();
}

function update_pssm(){
  var current_ch = $j("#chain_selector").val();
  var current_iter = parseInt($j("#iter_selector").val());
  var current_type = $j("#type_selector").val();
  pssm_viewer.display_table({type:current_type, iter:current_iter, chain:current_ch});
  structure_viewer.highlight_chain(globals.pdb,current_ch);
  cons_viewer();
}

function row_click(e){
  var n = parseInt($j(e).attr("index"));
  $j(".marked").removeClass("marked");
  $j(e).addClass("marked");
  var current_ch = $j("#chain_selector").val();
  var res_id = globals.mapping[current_ch]['align'][n-1];
  var current_iter = parseInt($j("#iter_selector").val());
  var a = globals.pdb_descritpion[ current_ch ]["scores"][current_iter][n-1]["a"];
  var c1 = parseInt(a*255/4 );
  if(c1>255)c1=255;
  var c2 = 255-c1;
  var col = "rgb(255,"+c2+","+c2+")";
  structure_viewer.color_by_chain_simple([res_id], globals.pdb, current_ch, col);
}

function mark_row(n){
  $j(".marked").removeClass("marked");
  var row =$j("[index=\""+n+"\"]");
  row.addClass("marked");
  var container = $j('#pssm_viewport');
  var scrollTo = row;

  container.animate( {scrollTop:scrollTo.offset().top - container.offset().top + container.scrollTop()-50 - container.height()*0.45} );
}
