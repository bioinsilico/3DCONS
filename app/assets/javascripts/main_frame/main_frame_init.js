
$j(document).ready(function(){
  var current_ch = globals.chains[0];
  var current_seq_id  = globals.pdb_descritpion[current_ch]['seq_id'];
  var current_iter = 0

  pssm_viewer.display_table({type:'psfm', iter:current_iter, chain:current_ch});

  var msa_url = "/msa/"+current_seq_id+"/"+current_iter;
  var zoomer = {
    alignmentWidth: $j("#msa_frame").width(),
    alignmentHeight: $j("#msa_frame").height(),
    columnWidth: 15,
    rowHeight: 15,
    autoResize: true
  };
  msa_viewer = msa( {el:document.getElementById("msa_viewport"),importURL:msa_url,zoomer:zoomer} );

});
