
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
      var V = self._.flatten(["<td>"+aa['index']+"</td>", "<td>"+aa['aa']+"</td>", row, "<td>"+aa['a']+"</td>", "<td>"+aa['b']+"</td>"])
      return "<tr>"+V.join("")+"</tr>";
    });
    var table = "<table>"+tbody.join("")+"</table>";
    self.$j('#'+self.eid).html( table );
  }

}
