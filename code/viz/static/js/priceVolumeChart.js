
buildPriceVolumeChart = function(data) {
    console.log('buildPriceVolumeChart');
    const margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 960 * 0.75 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#components").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "priceVolumeChart")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    var parseDate = d3.timeParse("%Y-%m-%d"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(","),
        dateFormatter = d3.timeFormat("%m/%d/%y");

    data = data.map(function(d) {
        return {
            date: parseDate(d.date),
            price: d.price,
            volume: d.volume,
            prediction: d.prediction
        }})
    // line chart with date on x axis and price on y axis
    var x = d3.scaleTime()
        .range([0, width]);
    var y = d3.scaleLinear()
        .range([height, 0]);
    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.price); })
        .defined(function(d) { return !d.prediction });
    
    var prediction_line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.price); })
        .defined(function(d,i) { return d.prediction || ( i < data.length && data[i+1].prediction); });
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.price; })]);

   

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    // add line with animation
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke-dasharray", function(d) {
            return this.getTotalLength()
          })
          .attr("stroke-dashoffset", function(d) {
            return this.getTotalLength()
          });
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", prediction_line)
        .attr("stroke-dasharray", function(d) { return this.getTotalLength() })
        .attr("stroke-dashoffset", function(d) { return this.getTotalLength() });

    
    svg.selectAll(".line")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);


    svg.append("text")  
        .attr("x", (width / 2))
        .attr("y", 20 - (margin.top / 2))
        .attr("class", "componentTitle")
        .text("Price and Volume Chart");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", height + (margin.bottom / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Date");
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -5 - (margin.left / 2))
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Price");

    svg.select(".x.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    svg.select(".x.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    svg.select(".y.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    svg.select(".y.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");

    // add tooltip
    
    var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 5);

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 18)
            .attr("y", -2);

        focus.append("text")
            .attr("class", "tooltip-price")
            .attr("x", 18)
            .attr("y", 18)
            .text("Price:");

        focus.append("text")
            .attr("class", "tooltip-price")
            .attr("x", 60)
            .attr("y", 18);
    mousemove = function() {
        var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
        focus.select(".tooltip-date").text(dateFormatter(d.date));
        focus.select(".tooltip-price").text("Price:" + formatValue(d.price));
    }
    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);
    
   
}