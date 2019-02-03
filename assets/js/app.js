// @TODO: YOUR CODE HERE!


// Reference code from: https://bl.ocks.org/mbostock/3019563

// defining area
var svgWidth = 900;
var svgHeight = 500;

// define margins
var margin = {
    top: 20,
    right: 10,
    bottom: 40,
    left: 10
};

// define inner dimensions of chart
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
    

// http://tutorials.jenkov.com/svg/g-element.html
var chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

 
//d3.select("#scatter").append("div").attr("class", "tooltip").style("opacity", 1);
var div = d3.select("#scatter").append("div").attr("class", "tooltip");

// grab data from CSV

// this marked out d3.csv piece was killing me
// need to look at this a bit closer to figure out
// where I went wrong
// d3.csv("assets/data/data.csv", function(error, dataDabbler){
//     if (error) throw error;


d3.csv("assets/data/data.csv").then(function(dataDabbler){
    dataDabbler.forEach(function(data) {
    //   data.state = data.state;
    //   data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

    // Create scale functions
    // https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear
    var yScale = d3.scaleLinear().range([chartHeight, 0]);
    var xScale = d3.scaleLinear().range([0, chartWidth]);

    // Create axis functions
    
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    xScale.domain([0, d3.max(dataDabbler, function(data){
		return +data.poverty;
	})]);

	yScale.domain([0, d3.max(dataDabbler,function(data){
		return +data.healthStatus;
	})]);

    //scaling
    // variables to store the min and max values of csv file
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // Playing around with different ways to get min and max
    // for scale
    // for (var i = 0; i < data.poverty.length; i++) {
    //     var temp_x;
    //     var temp_x = data.poverty[i] + data.poverty[i];
    //     if (temp_x >= xMax) {xMax=temp_x;}
    // }

    // for (var i = 0; i < data.obesity.length; i++) {
    //     var temp_y;
    //     var temp_y = data.obesity[i] + data.obesity[i];
    //     if (temp_y >= yMax) {yMax=temp_y;}
    // }

    var xMin = d3.min(dataDabbler, function(data) {
        return +data.poverty * 0.9;
    });

    var xMax = d3.max(dataDabbler, function(data) {
        return +data.poverty * 1.1;
    });

    var yMin = d3.min(dataDabbler, function(data) {
        return +data.obesity * 0.1;
    });

    var yMax = d3.max(dataDabbler, function(data) {
        return +data.obesity * 1.1;
    });

    xScale.domain([xMin, xMax]);
    yScale.domain([yMin, yMax]);
    console.log(xMin);
    console.log(yMax);

    var state_text = "State: "
    var pov_perc = "Poverty(%): "
    var obesity_perc = "Obesity(%): "
    
    // create scatter chart
    chart.selectAll("circle")
        .data(dataDabbler)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xScale(data.poverty);
        })
        .attr("cy", function(data, index) {
            return yScale(data.obesity);
        })
        .attr("r", 12)
        .attr("fill", "red")
        // display tooltip on click
        .on("mouseover", function (data) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html(state_text.bold() + data.state + "<br/>" + pov_perc.bold() + data.poverty + "<text>%</text>" + "<br/>" + obesity_perc.bold() + data.obesity + "<text>%</text>")
                .style("left", (d3.event.pageX)+ 10 + "px")
                .style("top", (d3.event.pageY - 0) + "px");
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data, index) {
            div.transition()
                .duration(500)
                .style("opacity",0);
        });

        chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "arial")
        .selectAll("tspan")
        .data(dataDabbler)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xScale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yScale(data.obesity - 0.1);
            })
            .text(function(data) {
                return data.abbr
                });

    // Append an SVG group for the xaxis, then display x-axis 
    chart.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    chart.append("g").call(leftAxis);

    chart.append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 20)
        .attr("x", 0 - chartHeight/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Obesity %");
  
    // x axis labels
    chart.append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr(
            "transform",
            "translate(" + chartWidth / 2 + " ," + (chartHeight + margin.top + 10) + ")"
        )
        .attr("class", "axis-text")
        .text("Poverty %");



});