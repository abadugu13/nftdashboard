buildSentimentChart = function(data) {
    console.log('buildSentimentChart');
    const margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 960 * 0.75 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    var svg = d3.select("#components").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "sentimentChart")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var parseDate = d3.timeParse("%Y-%m-%d"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(","),
        dateFormatter = d3.timeFormat("%m/%d/%y");
    
    data = data.map(function(d) {
        return {
            date: parseDate(d.date),
            sentiment: d.sentiment,
            volume: d.volume
        }})
    
    // line chart with date on x axis and sentiment on y axis with radial gradient

    var x = d3.scaleTime()
        .range([0, width]);
    var y = d3.scaleLinear()
        .range([height/2, 0]);
    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.sentiment); });
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([-1, 1]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Sentiment");
    
    // add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("class", "componentTitle")
        .text("Sentiment");
    
    // add y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 25 - margin.left)
        .attr("x",0 - (height / 4))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Sentiment");

    // add line with area with radial gradient
    var area = d3.area()
        .x(function(d) { return x(d.date); })
        .y0(y(0))   // y0 is the y coordinate of the bottom of the area
        .y1(function(d) { return y(d.sentiment); });
    
    var lg = svg.append("defs").append("linearGradient")
    .attr("id", "area")//id of the gradient
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", y(-1))
    .attr("y2", y(1));
    ;

    lg.append("stop")
    .attr("offset", "0%")
    .style("stop-color", "#fa5457")//start in red
    .style("stop-opacity", 1)

    lg.append("stop")
    .attr("offset", "50%")
    .style("stop-color", "#ffff")//mid in white
    .style("stop-opacity", 1)

    lg.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "#5fa55a")//end in green
    .style("stop-opacity", 1)
  
    
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .attr("fill", "url(#area)");
    
    
    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");
    
    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 50)
        .attr("x", 10)
        .attr("y", -22)


    focus.append("text")
        .attr("id", "tooltipDateSentiment")
        .attr("class", "tooltip-text")
        .attr("x", 18)
        .attr("y", -2);
    
    focus.append("text")
        .attr("id", "tooltipVolume")
        .attr("class", "tooltip-text")
        .attr("x", 18)
        .attr("y", 18);

    focus.append("path")
        .attr("class", "line")
        .style("stroke-dasharray", "5,5")

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height/2)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);
    
    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.sentiment) + ")");
        focus.select("text.tooltip-text").text(function() { return dateFormatter(d.date) + ": " + formatValue(d.sentiment) });
        focus.select("#tooltipVolume").text(function() { return "Volume: " + formatValue(d.volume); });
        // focus.select("text.tooltip-text").attr("x", 18 - x(d.date));
        // focus.select("text.tooltip-text").attr("y", 18);
        var path_ = d3.line()([[0, 3*y(-1)- y(d.sentiment)], [0, y(1) - y(d.sentiment)]]);
        focus.select("path.line").attr("d", path_);
    }
    
    svg.select(".x.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    svg.select(".x.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    svg.select(".y.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    svg.select(".y.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    
        
    // add volume chart
    yVolume = d3.scaleLinear()
        .range([height/2, 0])
        .domain([0, d3.max(data, function(d) { return d.volume; })]);
    var yAxisVolume = d3.axisLeft(yVolume);

    svg.append("g")
        .attr("class", "volume")    
        .attr("transform", "translate(" + 0 + "," + (height/2 + margin.bottom/2) + ")");  
    
    var volume = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return yVolume(d.volume); });
    
    svg.select(".volume").append("path")
        .datum(data)
        .attr("class", "volume")
        .attr("d", volume);
    
    svg.select(".volume").append("g")
        .attr("class", "y axis")
        .call(yAxisVolume);
    
    //x-axis
   
    svg.select(".volume").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    svg.select(".volume").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    
    // y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("y", 25-margin.left)
        .attr("x", -0.75 * height)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Volume");


}