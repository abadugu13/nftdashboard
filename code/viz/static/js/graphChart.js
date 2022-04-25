buildSentimentChart = function(data) {
    console.log('buildSentimentChart');
    const margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 960 * 0.75 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    var svg = d3.select("#components").append("svg")
        .style("border", "3px solid rgba(30, 28, 28, 0.516)")
        .style("border-bottom", "none")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "sentimentChart")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var parseDate = d3.timeParse("%m-%d-%Y"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(","),
        dateFormatter = d3.timeFormat("%m/%d/%y");
    
    data = data.map(function(d) {
        return {
            date: parseDate(d.date),
            sentiment: d.sentiment,
            volume: d.volume
        }})
    console.log(data.slice(0, 10));
    
    // line chart with date on x axis and sentiment on y axis with radial gradient

    var x = d3.scaleTime()
        .range([0, width-70]);
    var y = d3.scaleLinear()
        .range([height/2, 0]);
    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.sentiment); });
    var xAxis = d3.axisBottom(x)
    var yAxis = d3.axisLeft(y);
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([-1, 1]);

    

    // rotate x axis labels by 45 degrees
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(xAxis)

    svg.selectAll(".x.axis text").attr("transform", "translate(0,10)rotate(-45)")
    
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
        .text("Twitter sentiment over time");
    
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
        // .curve(d3.curveBasis)
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
    .style("stop-color", "#d73010")//start in red
    .style("stop-opacity", 1)

    lg.append("stop")
    .attr("offset", "25%")
    .style("stop-color", "#e94f2e")//start in red
    .style("stop-opacity", 1)

    lg.append("stop")
    .attr("offset", "50%")
    .style("stop-color", "#FAF9F6")//mid in white
    .style("stop-opacity", 1)
    
    lg.append("stop")
    .attr("offset", "75%")
    .style("stop-color", "#35df91")//end in green
    .style("stop-opacity", 1)

    lg.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "#179058")//end in green
    .style("stop-opacity", 1)

    var lg2 = svg.append("defs").append("linearGradient")
    .attr("id", "area2")//id of the gradient
    .attr("x1", "0%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "100%");
    ;

    lg2.append("stop")
    .attr("offset", "0%")
    .style("stop-color", "#80a7be")//start in red
    .style("stop-opacity", 1)
    
    lg2.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "#abe0ff")//start in red
    .style("stop-opacity", 1)


  
    
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area)
        .style("stroke", "darkgrey")
        .attr("fill", "url(#area)");

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
    
    var volumeArea = d3.area()
        .x(function(d) { return x(d.date); })
        .y0(height/2)
        .y1(function(d) { return yVolume(d.volume); });
    
    svg.select(".volume").append("path")
        .datum(data)
        .attr("class", "volume")
        .attr("d", volumeArea)
        .style("stroke", "none")
        .style("fill", "url(#area2)");

    svg.select(".volume").append("g")
        .attr("class", "y axis")
        .call(yAxisVolume);
    
    //x-axis
   
    // svg.select(".volume").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    // svg.select(".volume").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    
    // y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("y", 25-margin.left)
        .attr("x", -0.75 * height)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("No. of tweets");
    
    
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
        .style("stroke", "black")
        .style("stroke-dasharray", "5,5")

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
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
        focus.select("text.tooltip-text").text(function() { return dateFormatter(d.date) + ": " + formatValue(Math.round(d.sentiment * 100) / 100
        ) });
        focus.select("#tooltipVolume").text(function() { return "Volume: " + formatValue(d.volume); });
        // focus.select("text.tooltip-text").attr("x", 18 - x(d.date));
        // focus.select("text.tooltip-text").attr("y", 18);
        var path_ = d3.line()([[0, 3*y(-1)- y(d.sentiment)-10], [0, y(1) - y(d.sentiment)-10]]);
        focus.select("path.line").attr("d", path_);
    }
    
    // svg.select(".x.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    // svg.select(".x.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    // svg.select(".y.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    // svg.select(".y.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    
        
    // add volume chart
    


}