
$j(document).ready(function(){
  var current_ch = globals.chains[0];
  var current_seq_id  = globals.pdb_descritpion[current_ch]['seq_id'];
  var current_iter = 0

  pssm_viewer.display_table({type:'psfm', iter:current_iter, chain:current_ch});
});
