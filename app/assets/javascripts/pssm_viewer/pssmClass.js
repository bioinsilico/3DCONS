
function pssmClass( args ){
  var self = this;
  self.args = args;
  self.data = args.pdb_description;
  self.$j = args.jQuery;
  self.eid = args.id;
  self._ = args.underscore;
  
  self.display_pssm = function( opt ){
    var iter  = opt.iter;
    var chain = opt.chain;
    if( self.data[chain]['status'][iter] != 0 ){
      swal("DATA NOT FOUND");
      return;
    }
    self.$j('#'+self.eid).html('');
    self.display_table( opt );
  }

  self.display_table =  function( opt ){
    var type = opt.type;
    var iter  = opt.iter;
    var chain = opt.chain;
    var X = self.data[chain]['scores'][iter];
    var tbody = self._.map( X, function( aa ){
      var row = self._.map(aa[type],function(val){
        return "<td>"+val+"</td>";
      });
      var w = parseInt(aa['a']*30);
      var c = parseInt( aa['a']/4*200 );
      c += 55;
      if(c>255)c=255;
      var c1 = c;
      var c2 = 255-c;
      if(c2>200)c2=200;
      //var color = "background:linear-gradient(to right, rgb(255,0,0), rgb(255,"+c2+","+c2+"), rgb(255,"+c2+","+c2+") )";
      var color = "background:rgb(255,"+c2+","+c2+")";
      var cons  = "<div class=\"cons_val\" style=\""+color+";height:12px;width:"+w+"px;\"></div>";
      var V = self._.flatten(["<td><span>"+aa['res_id']+"</span></td>", "<td>"+aa['aa']+"</td>", row, "<td>"+aa['b']+"</td>", "<td>"+aa['a']+"</td>","<td>"+cons+"</td>"])
      return "<tr title=\"RES ID "+aa['res_id']+"&#013;SEQ ID "+aa['index']+"\" index=\""+aa['index']+"\">"+V.join("")+"</tr>";
    });
    var head = ["A","R","N","D","C","Q","E","G","H","I","L","K","M","F","P","S","T","W","Y","V"];
    head = self._.map(head,function(i){
        return "<td>"+i+"</td>";
    });
    var w = parseInt(5*30);
    var cons  = "<div class=\"cons_val\" style=\"background:white;height:12px;width:"+w+"px;\"></div>";
    var H = self._.flatten(["<td>"+"&nbsp;"+"</td>", "<td>"+"&nbsp;"+"</td>",head, "<td>"+"&nbsp;"+"</td>", "<td>"+"&nbsp;"+"</td>","<td>"+cons+"</td>"]);
    var table_head ="<table class=\"pssm_table\"><tr>"+H.join("")+"</tr></table>";
    var table = "<table class=\"pssm_table\">"+tbody.join("")+"</table>";
    self.$j('#'+self.eid).html( table_head+table );
    self.$j("table.pssm_table tr").click(function(){
      row_click( this );
    });
  }

}
