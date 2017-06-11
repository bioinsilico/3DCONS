
$j(document).ready(function(){
  var current_ch = $j("#chain_selector").val();
  var current_iter = parseInt($j("#iter_selector").val());
  var current_type = $j("#type_selector").val();

  pssm_viewer.display_table({type:current_type, iter:current_iter, chain:current_ch});
  structure_viewer.highlight_chain(globals.pdb,current_ch);

  $j("#chain_selector").change(function(){
    chain_selected();
  });

  $j("#type_selector").change(function(){
    update_pssm();
  });

  $j("#iter_selector").change(function(){
    update_pssm();
  }); 


});
