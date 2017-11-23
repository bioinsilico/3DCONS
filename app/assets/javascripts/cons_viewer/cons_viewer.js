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
  
  
  var box_width = Math.round(  ($j("#pssm_viewport").height()-50)/29 );

  d3.select("#cons_viewport").html("");
  svg = d3.select("#cons_viewport").append("svg").attr("height","100%").attr("width","100%");     
  
  var width = parseInt(svg.style("width")); 
  var height = parseInt(svg.style("height"));

  var a = 20;
  var b = 35;

  var x = d3.scaleLinear().domain([0,dataArray.length]).range([0, width-b]);
  x_scale = x;
  var y = d3.scaleLinear().domain([0,5]).range([height-60,a+5]);
  
  var curve = d3.line()
      .x(function(d) { return x(d.x); })
      .y(function(d) { return y(d.y); })
      .curve( d3.curveStepBefore );
  
  var g = svg.append("g")
    .append("path")
    .style("fill","#FFCCCC")
    .style("stroke","red")
    .style("stroke-width","1px")
    .attr("d",function(d,i){ return curve(dataArray); });
  g.attr("transform", "translate("+b+","+(-1*a)+")");

  var g = svg.append("line")
    .attr("x1",x(0))
    .attr("x2",x(dataArray.length-2))
    .attr("y1",y(0))
    .attr("y2",y(0))
    .style("stroke-width","0.75px")
    .style("stroke","rgb(255,0,0)")

  g.attr("transform", "translate("+b+","+(-1*a)+")");

  
  var DOM = globals.dom[ current_ch ]
  var prev_end = 0;
  if(DOM){
    _.sortBy(DOM, function(d) {return parseFloat(d.begin)} ).forEach(function(d){
      console.log(d);
      var begin = globals.mapping[current_ch].inverse[d.begin];
      var end = globals.mapping[current_ch].inverse[d.end];
      var width = end-begin;
      if(prev_end<begin){
        var g = svg.append("line")
          .attr("x1",x(prev_end+0.2))
          .attr("x2",x(begin-0.2))
          .attr("y1",y(-0.5)+10)
          .attr("y2",y(-0.5)+10)
          .style("stroke-width","3px")
          .style("stroke","rgb(150,150,150)")
        g.attr("transform", "translate("+b+","+(-1*a)+")");       
      }
      prev_end = end;
      var g = svg.append("rect")
        .style("fill","rgb(255,0,102)")
        .style("fill-opacity","0.2")
        .style("stroke","rgb(255,0,102)")
        .style("stroke-width","1px")
        .style("cursor","pointer")
        .attr("x",x(begin))
        .attr("y",y(-0.5))
        .attr("height",20)
        .attr("width",x(width))
      g.on("click",function(){
        window.open("http://pfam.xfam.org/family/"+d.id); 
      });
      g.append("title").text(d.desc)
      g.attr("transform", "translate("+b+","+(-1*a)+")");   
      var g = svg.append("text")
        .attr("x",x(begin+0.5*width))
        .attr("y",y(-0.4))
        .text(d.name);
    });
  }

  if( prev_end < dataArray.length ){
      var g = svg.append("line")
        .attr("x1",x(prev_end+0.2))
        .attr("x2",x(dataArray.length-0.2))
        .attr("y1",y(-0.5)+10)
        .attr("y2",y(-0.5)+10)
        .style("stroke-width","3px")
        .style("stroke","rgb(150,150,150)")
      g.attr("transform", "translate("+b+","+(-1*a)+")");       
  }

  var g = svg.append("rect")
    .attr("id","svg_window" )
    .style("fill","none")
    .style("stroke","#C0C0C0")
    .style("stroke-width","1px")
    .attr("x",x(0.1) )
    .attr("y",a+5 )
    .attr("height",height-(a+5))
    .attr("width",x(box_width));
  g.attr("transform", "translate("+b+","+(-1*a)+")");

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+b+"," + (height-a) + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+25+","+(-1*a)+")")
      .call(d3.axisLeft(y).ticks(5));

  update_cons();
}


function update_cons(){
  var x = Math.round( $j("#pssm_viewport").scrollTop()/29  );
  svg.selectAll("#svg_window").attr( "x",x_scale(x) );
}
