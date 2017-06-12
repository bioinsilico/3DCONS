var svg, x_scale;

function cons_viewer(){

  var current_ch = $j("#chain_selector").val();
  var current_iter = parseInt($j("#iter_selector").val());
  var current_type = $j("#type_selector").val();
  
  var dataArray = [{x:0,y:0}];
  
  _.each(globals.pdb_descritpion[ current_ch ]["scores"][current_iter],function(i){
    dataArray.push({x:parseInt(i["index"]),y:parseFloat(i["a"])});
  });
  dataArray.push({x:dataArray.length,y:0});
  
  
  var box_width = parseInt(($j("#pssm_viewport").height()-50)/30);

  d3.select("#cons_viewport").html("");
  svg = d3.select("#cons_viewport").append("svg").attr("height","100%").attr("width","100%");     
  
  var width = parseInt(svg.style("width")); 
  var height = parseInt(svg.style("height"));
  var x = d3.scaleLinear().domain([0,dataArray.length]).range([0, width]);
  x_scale = x;
  var y = d3.scaleLinear().domain([0,5]).range([height,0]);
  
  var curve = d3.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); })
      .curve( d3.curveStepBefore );
  
  svg.append("path")
    .style("fill","#FFCCCC")
    .style("stroke","red")
    .style("stroke-width","1px")
    .attr("d",function(d,i){ return curve(dataArray); });

  svg.append("rect")
    .style("fill","none")
    .style("stroke","#C0C0C0")
    .style("stroke-width","3px")
    .attr("x",x(0) )
    .attr("height",y(0))
    .attr("width",x(box_width));
}


function update_cons(){
  var x = parseInt( $j("#pssm_viewport").scrollTop()/57*2 );
  console.log( $j("#pssm_viewport").scrollTop() );
  svg.selectAll("rect").attr( "x",x_scale(x) );
}
