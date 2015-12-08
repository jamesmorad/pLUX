var json_response = null;

function get_event(){$.ajax({
    url: '/get_evt',
    type: 'GET',
    contentType: "application/json; charset=utf-8",
    success: function(data_series) {
      console.log("luxstamp_samples: " + data_series.luxstamp_samples);
      console.log("pulse_start_samples: " + data_series.pulse_start_samples);
      draw_event(data_series);
      draw_hitmap_top(data_series);
      draw_hitmap_bottom(data_series);
      draw_color_scale();
       $("#pulse_area").html("<h5>Pulse area (phe) = " + data_series['pulse_area_phe'] + "<p></h5>");
       $("#pulse_width").html("<h5>Pulse width (ns) = " + data_series['aft_width'] + "</h5>");
      json_response=data_series;
    },
  cache: false
});
};

function send_classification(classification){
  $.ajax({
    url: '/user_classification',
    type: 'POST',
    data: JSON.stringify(classification),
    contentType: "application/json; charset=utf-8",
    success: function(response) {
        d3.select("#event_plot").remove();
        d3.select("#top_hitmap_svg").remove();
        d3.select("#bottom_hitmap_svg").remove();
        get_event();
    },
  cache: false
  });
  var user_info = {
    "email":classification['email'],
    "username":classification['username']
  }
  get_stats(user_info);
}

function get_stats(user_info){
  $.ajax({
    url: '/user_stats',
    type: 'POST',
    data: JSON.stringify(user_info),
    contentType: "application/json; charset=utf-8",
    success: function(response) {
      console.log(response);
      if (response > 0){
        $("#stats").html("You have classified " + response + " pulses so far!");
      }
      else{
        $("#stats").html("No stats recorded");
      }
    },
  cache: false
  });
}

function draw_hitmap_top(data_series){

function cell_dim(total, cells) { return Math.floor(total/cells) }
  var total_height = 150;
  var total_width = 150;
  var rows = 17;
  var cols = 17;
  var row_height = cell_dim(total_height, rows);
  var col_width = cell_dim(total_width, cols);
  var radius = total_height/rows/2.;
  var data = [];

  for (var i = 0; i < (rows * cols); i++) {
    data[i] = -.1;
  }

  //then initialize hex grid...this is so godamn ugly
  //first row, top
  data[4] = 0;
  data[6] = 0;
  data[8] = 0;
  data[10] = 0;
  data[12] = 0;
  //second row,top
  data[37] = 0;
  data[39] = 0;
  data[41] = 0;
  data[43] = 0;
  data[45] = 0;
  data[47] = 0;
  //third row, top
  data[70] = 0;
  data[72] = 0;
  data[74] = 0;
  data[76] = 0;
  data[78] = 0;
  data[80] = 0;
  data[82] = 0;
  //fourth row, top
  data[103] = 0;
  data[105] = 0;
  data[107] = 0;
  data[109] = 0;
  data[111] = 0;
  data[113] = 0;
  data[115] = 0;
  data[117] = 0;
  //fifth row, top
  data[136] = 0;
  data[138] = 0;
  data[140] = 0;
  data[142] = 0;
  data[144] = 0;
  data[146] = 0;
  data[148] = 0;
  data[150] = 0;
  data[152] = 0;
  //sixth row, top
  data[171] = 0;
  data[173] = 0;
  data[175] = 0;
  data[177] = 0;
  data[179] = 0;
  data[181] = 0;
  data[183] = 0;
  data[185] = 0;
  //seventh row
  data[206] = 0;
  data[208] = 0;
  data[210] = 0;
  data[212] = 0;
  data[214] = 0;
  data[216] = 0;
  data[218] = 0;
  //eigth row
  data[241] = 0;
  data[243] = 0;
  data[245] = 0;
  data[247] = 0;
  data[249] = 0;
  data[251] = 0;
  //ninth row
  data[276] = 0;
  data[278] = 0;
  data[280] = 0;
  data[282] = 0;
  data[284] = 0;

  //now set data

  //first row, top
  data[4] = data_series.peak_area_phe[0];
  data[6] = data_series.peak_area_phe[53];
  data[8] = data_series.peak_area_phe[52];
  data[10] = data_series.peak_area_phe[51];
  data[12] = data_series.peak_area_phe[50];
  //second row,top
  data[37] = data_series.peak_area_phe[1];
  data[39] = data_series.peak_area_phe[4];
  data[41] = data_series.peak_area_phe[56];
  data[43] = data_series.peak_area_phe[55];
  data[45] = data_series.peak_area_phe[54];
  data[47] = data_series.peak_area_phe[43];
  //third row, top
  data[70] = data_series.peak_area_phe[2];
  data[72] = data_series.peak_area_phe[5];
  data[74] = data_series.peak_area_phe[7];
  data[76] = data_series.peak_area_phe[58];
  data[78] = data_series.peak_area_phe[57];
  data[80] = data_series.peak_area_phe[46];
  data[82] = data_series.peak_area_phe[42];
  //fourth row, top
  data[103] = data_series.peak_area_phe[3];
  data[105] = data_series.peak_area_phe[6];
  data[107] = data_series.peak_area_phe[8];
  data[109] = data_series.peak_area_phe[9];
  data[111] = data_series.peak_area_phe[59];
  data[113] = data_series.peak_area_phe[48];
  data[115] = data_series.peak_area_phe[45];
  data[117] = data_series.peak_area_phe[41];
  //fifth row, top
  data[136] = data_series.peak_area_phe[10];
  data[138] = data_series.peak_area_phe[14];
  data[140] = data_series.peak_area_phe[17];
  data[142] = data_series.peak_area_phe[19];
  data[144] = data_series.peak_area_phe[120];
  data[146] = data_series.peak_area_phe[49];
  data[148] = data_series.peak_area_phe[47];
  data[150] = data_series.peak_area_phe[44];
  data[152] = data_series.peak_area_phe[40];
  //sixth row, top
  data[171] = data_series.peak_area_phe[11];
  data[173] = data_series.peak_area_phe[15];
  data[175] = data_series.peak_area_phe[18];
  data[177] = data_series.peak_area_phe[29];
  data[179] = data_series.peak_area_phe[39];
  data[181] = data_series.peak_area_phe[38];
  data[183] = data_series.peak_area_phe[36];
  data[185] = data_series.peak_area_phe[33];
  //seventh row
  data[206] = data_series.peak_area_phe[12];
  data[208] = data_series.peak_area_phe[16];
  data[210] = data_series.peak_area_phe[27];
  data[212] = data_series.peak_area_phe[28];
  data[214] = data_series.peak_area_phe[37];
  data[216] = data_series.peak_area_phe[35];
  data[218] = data_series.peak_area_phe[32];
  //eigth row
  data[241] = data_series.peak_area_phe[13];
  data[243] = data_series.peak_area_phe[24];
  data[245] = data_series.peak_area_phe[25];
  data[247] = data_series.peak_area_phe[26];
  data[249] = data_series.peak_area_phe[34];
  data[251] = data_series.peak_area_phe[31];
  //ninth row
  data[276] = data_series.peak_area_phe[20];
  data[278] = data_series.peak_area_phe[21];
  data[280] = data_series.peak_area_phe[22];
  data[282] = data_series.peak_area_phe[23];
  data[284] = data_series.peak_area_phe[30];


  var color_chart = d3.select($("#top_hitmap").get(0))
                      .append("svg")
                      .attr("id","top_hitmap_svg")
                      .attr("class", "chart")
                      .attr("width", 2*radius* cols)
                      .attr("height", 2*radius * rows);
  var color = d3.scale.linear()
        .domain([0,0.33,0.66,1])
        .range([ "white","cyan","yellow","red"]);
  color_chart.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cy", function(d,i) { return Math.floor(i / rows) * col_width+radius; })
            .attr("cx", function(d,i) { return i % rows * row_height + radius; })
            .attr("r", radius)
            //.attr("width", col_width)
            //.attr("height", row_height)
            .attr("fill", color)
            .style("stroke", function(d) {if(d>= 0) strokecolor="#000000"; else strokecolor="#FFFFFF"; return strokecolor;})
            .style("stroke-width", function(d) {if(d>= 0) strokewidth="1"; else strokewidth="0"; return strokewidth;});

};

function draw_hitmap_bottom(data_series){

function cell_dim(total, cells) { return Math.floor(total/cells) }
  var total_height = 150;
  var total_width = 150;
  var rows = 17;
  var cols = 17;
  var row_height = cell_dim(total_height, rows);
  var col_width = cell_dim(total_width, cols);
  var radius = total_height/rows/2.;
  var data = [];

  for (var i = 0; i < (rows * cols); i++) {
    data[i] = -1;
  }
  //then initialize hex grid...this is so godamn ugly
  //first row, top
  data[4] = 0;
  data[6] = 0;
  data[8] = 0;
  data[10] = 0;
  data[12] = 0;
  //second row,top
  data[37] = 0;
  data[39] = 0;
  data[41] = 0;
  data[43] = 0;
  data[45] = 0;
  data[47] = 0;
  //third row, top
  data[70] = 0;
  data[72] = 0;
  data[74] = 0;
  data[76] = 0;
  data[78] = 0;
  data[80] = 0;
  data[82] = 0;
  //fourth row, top
  data[103] = 0;
  data[105] = 0;
  data[107] = 0;
  data[109] = 0;
  data[111] = 0;
  data[113] = 0;
  data[115] = 0;
  data[117] = 0;
  //fifth row, top
  data[136] = 0;
  data[138] = 0;
  data[140] = 0;
  data[142] = 0;
  data[144] = 0;
  data[146] = 0;
  data[148] = 0;
  data[150] = 0;
  data[152] = 0;
  //sixth row, top
  data[171] = 0;
  data[173] = 0;
  data[175] = 0;
  data[177] = 0;
  data[179] = 0;
  data[181] = 0;
  data[183] = 0;
  data[185] = 0;
  //seventh row
  data[206] = 0;
  data[208] = 0;
  data[210] = 0;
  data[212] = 0;
  data[214] = 0;
  data[216] = 0;
  data[218] = 0;
  //eigth row
  data[241] = 0;
  data[243] = 0;
  data[245] = 0;
  data[247] = 0;
  data[249] = 0;
  data[251] = 0;
  //ninth row
  data[276] = 0;
  data[278] = 0;
  data[280] = 0;
  data[282] = 0;
  data[284] = 0;

  //now set data


  //first row, top
  data[4] = data_series.peak_area_phe[60];
  data[6] = data_series.peak_area_phe[113];
  data[8] = data_series.peak_area_phe[112];
  data[10] = data_series.peak_area_phe[111];
  data[12] = data_series.peak_area_phe[110];
  //second row,top
  data[37] = data_series.peak_area_phe[61];
  data[39] = data_series.peak_area_phe[64];
  data[41] = data_series.peak_area_phe[116];
  data[43] = data_series.peak_area_phe[115];
  data[45] = data_series.peak_area_phe[114];
  data[47] = data_series.peak_area_phe[103];
  //third row, top
  data[70] = data_series.peak_area_phe[62];
  data[72] = data_series.peak_area_phe[65];
  data[74] = data_series.peak_area_phe[67];
  data[76] = data_series.peak_area_phe[118];
  data[78] = data_series.peak_area_phe[117];
  data[80] = data_series.peak_area_phe[106];
  data[82] = data_series.peak_area_phe[102];
  //fourth row, top
  data[103] = data_series.peak_area_phe[63];
  data[105] = data_series.peak_area_phe[66];
  data[107] = data_series.peak_area_phe[68];
  data[109] = data_series.peak_area_phe[69];
  data[111] = data_series.peak_area_phe[119];
  data[113] = data_series.peak_area_phe[108];
  data[115] = data_series.peak_area_phe[105];
  data[117] = data_series.peak_area_phe[101];
  //fifth row, top
  data[136] = data_series.peak_area_phe[70];
  data[138] = data_series.peak_area_phe[74];
  data[140] = data_series.peak_area_phe[77];
  data[142] = data_series.peak_area_phe[79];
  data[144] = data_series.peak_area_phe[121];
  data[146] = data_series.peak_area_phe[109];
  data[148] = data_series.peak_area_phe[107];
  data[150] = data_series.peak_area_phe[104];
  data[152] = data_series.peak_area_phe[100];
  //sixth row, top
  data[171] = data_series.peak_area_phe[71];
  data[173] = data_series.peak_area_phe[75];
  data[175] = data_series.peak_area_phe[78];
  data[177] = data_series.peak_area_phe[89];
  data[179] = data_series.peak_area_phe[99];
  data[181] = data_series.peak_area_phe[98];
  data[183] = data_series.peak_area_phe[96];
  data[185] = data_series.peak_area_phe[93];
  //seventh row
  data[206] = data_series.peak_area_phe[72];
  data[208] = data_series.peak_area_phe[76];
  data[210] = data_series.peak_area_phe[87];
  data[212] = data_series.peak_area_phe[88];
  data[214] = data_series.peak_area_phe[97];
  data[216] = data_series.peak_area_phe[95];
  data[218] = data_series.peak_area_phe[92];
  //eigth row
  data[241] = data_series.peak_area_phe[73];
  data[243] = data_series.peak_area_phe[84];
  data[245] = data_series.peak_area_phe[85];
  data[247] = data_series.peak_area_phe[86];
  data[249] = data_series.peak_area_phe[94];
  data[251] = data_series.peak_area_phe[91];
  //ninth row
  data[276] = data_series.peak_area_phe[80];
  data[278] = data_series.peak_area_phe[81];
  data[280] = data_series.peak_area_phe[82];
  data[282] = data_series.peak_area_phe[83];
  data[284] = data_series.peak_area_phe[90];

  var color_chart = d3.select($("#bottom_hitmap").get(0))
                      .append("svg")
                      .attr("id","bottom_hitmap_svg")
                      .attr("class", "chart")
                      .attr("width", col_width * cols)
                      .attr("height", row_height * rows);
  var color = d3.scale.linear()
      .domain([0,0.33,0.67,1])
      .range([ "white","cyan","yellow","red"]);
  color_chart.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cy", function(d,i) { return Math.floor(i / rows) * col_width +radius; })
            .attr("cx", function(d,i) { return i % rows * row_height+radius; })
            .attr("r", radius)
            //.attr("width", col_width)
            //.attr("height", row_height)
            .attr("fill", color)
            .style("stroke", function(d) {if(d>= 0) strokecolor="#000000"; else strokecolor="transparent"; return strokecolor;})
            .style("stroke-width", function(d) {if(d>= 0) strokewidth="1"; else strokewidth="0"; return strokewidth;});


};


function draw_color_scale(){
var margin = {top: 10, right: 40, bottom: 25, left: 0}
var color = d3.scale.linear()
      .domain([0,0.33,.67,1])
      .range([ "white","cyan","yellow","red"]);
colorbar = Colorbar()
    .origin([10,20])
    .scale(color)
    .orient("vertical")
    .thickness(5)
    .barlength(150)
    .margin(margin)

placeholder = "#color_scale"

colorbarObject = d3.select(placeholder)
    .call(colorbar)

};

function redraw_event(){
 d3.select("#event_plot").remove();
 draw_event(json_response); 
};


function draw_event(data_series){

  var time_scale = $('input[name=time_axis]:checked', '#time_axis_form').val();
  var xtitle;
  if (time_scale == 1){
    xtitle = "time (ns)";
  }
  else{
    xtitle = "time (samples)";
  }

  var data = [ { label: "",
               x: data_series.times.map(function(x) { return x/time_scale; }),
               y: data_series.pulse }
               ] ;
  var xy_chart = d3_xy_chart()
      .width(680)
      .height(480)
      .xlabel(xtitle)
      .ylabel("height (phe/sample)") ;
  var svg = d3.select("#graph").append("svg")
      .attr("id","event_plot")
      .datum(data)
      .call(xy_chart) ;

  function d3_xy_chart() {
      var width = 680,
          height = 480,
          xlabel = xtitle,
          ylabel = "height (phe/sample)" ;

      function chart(selection) {
          selection.each(function(datasets) {
              //
              // Create the plot.
              //
              var margin = {top: 20, right: 80, bottom: 50, left: 80},
                  innerwidth = width - margin.left - margin.right,
                  innerheight = height - margin.top - margin.bottom,
                  xlabel_loc = height - margin.top - margin.bottom +20 ;

              var x_scale = d3.scale.linear()
                  .range([0, innerwidth])
                  .domain([ d3.min(datasets, function(d) { return d3.min(d.x); }),
                            d3.max(datasets, function(d) { return d3.max(d.x); }) ]) ;

              var y_scale = d3.scale.linear()
                  .range([innerheight, 0])
                  .domain([ d3.min(datasets, function(d) { return d3.min(d.y); }),
                            d3.max(datasets, function(d) { return d3.max(d.y); }) ]) ;

              var color_scale = d3.scale.category10()
                  .domain(d3.range(datasets.length)) ;

              var x_axis = d3.svg.axis()
                  .scale(x_scale)
                  .orient("bottom") ;

              var y_axis = d3.svg.axis()
                  .scale(y_scale)
                  .orient("left") ;

              var x_grid = d3.svg.axis()
                  .scale(x_scale)
                  .orient("bottom")
                  .tickSize(-innerheight)
                  .tickFormat("") ;

              var y_grid = d3.svg.axis()
                  .scale(y_scale)
                  .orient("left")
                  .tickSize(-innerwidth)
                  .tickFormat("") ;
              /*
              var draw_line = d3.svg.line()
                  .interpolate("basis")
                  .x(function(d) { return x_scale(d[0]); })
                  .y(function(d) { return y_scale(d[1]); }) ;
                  */

              var draw_line = d3.svg.line()
                  .x(function(d) { return x_scale(d[0]); })
                  .y(function(d) { return y_scale(d[1]); }) ;

              var svg = d3.select(this)
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

              svg.append("g")
                  .attr("class", "x grid")
                  .attr("transform", "translate(0," + innerheight + ")")
                  .call(x_grid) ;

              svg.append("g")
                  .attr("class", "y grid")
                  .call(y_grid) ;

              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + innerheight + ")")
                  .call(x_axis)
                  .append("text")
                  .attr("dy", "2.2em")
                  .attr("x", innerwidth)
                  .style("text-anchor", "end")
                  .text(xlabel) ;

              svg.append("g")
                  .attr("class", "y axis")
                  .call(y_axis)
                  .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", "-3.5em")
                  .style("text-anchor", "end")
                  .text(ylabel) ;

              var data_lines = svg.selectAll(".d3_xy_chart_line")
                  .data(datasets.map(function(d) {return d3.zip(d.x, d.y);}))
                  .enter().append("g")
                  .attr("class", ".d3_xy_chart_line") ;

              data_lines.append("path")
                  .attr("class", "line")
                  .attr("d", function(d) {return draw_line(d); })
                  .attr("stroke", function(_, i) {return color_scale(i);}) ;

              data_lines.append("text")
                  .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; })
                  .attr("transform", function(d) {
                      return ( "translate(" + x_scale(d.final[0]) + "," +
                               y_scale(d.final[1]) + ")" ) ; })
                  .attr("x", 3)
                  .attr("dy", ".35em")
                  .attr("fill", function(_, i) { return color_scale(i); })
                  .text(function(d) { return d.name; }) ;

          }) ;
      }

      chart.width = function(value) {
          if (!arguments.length) return width;
          width = value;
          return chart;
      };

      chart.height = function(value) {
          if (!arguments.length) return height;
          height = value;
          return chart;
      };

      chart.xlabel = function(value) {
          if(!arguments.length) return xlabel ;
          xlabel = value ;
          return chart ;
      } ;

      chart.ylabel = function(value) {
          if(!arguments.length) return ylabel ;
          ylabel = value ;
          return chart ;
      } ;

      return chart;
  }
};



