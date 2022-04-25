buildVolumeChart = function(data){
    console.log("Volume Chart");
    const margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 960 * 0.75 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#components").append("svg")
        .style("border", "3px solid rgba(30, 28, 28, 0.516)")
        .style("border-right", "none")     
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "volumeChart")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    
    var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = d3.format(","),
        dateFormatter = d3.timeFormat("%Y-%m-%d");
    console.log(data.slice(0, 10));
    data = data.map(function(d) {
        return {
            date: parseDate(d.date),
            volume: d.volume,
            prediction: d.prediction
        }})
    
    data = data.filter(function(d) {
        return d.date > new Date("2020-01-01");
    });
    // bar chart with date on x axis and volume on y axis
    console.log(data.slice(0, 10));
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(function(d) { return d.date; }))
    var y = d3.scaleLinear()    
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d.volume; }) + 100]);
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    // x axis tick format
    xAxis.tickFormat(function(d) {
        return dateFormatter(d);
    }).tickValues(x.domain().filter(function(d, idx) { return idx%60==0 }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis.ticks(2));

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Volume");

    // add bar with animation
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(0); })
        .attr("y", function(d) { return y(0); })
        .attr("fill", function(d) { return d.prediction ? "red" : "steelblue"; })  
    
    svg.selectAll(".bar")
        .data(data)
        .transition()
        .duration(5000)
        .attr("y", function(d) { return y(d.volume); })
        .attr("fill", function(d) { return d.prediction ? "#f85701" : "#0190f8"; })
        .attr("height", function(d) { return height - y(d.volume); })
    
    // add tooltip
    svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    // add mouseover event
    svg.selectAll(".bar")
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", "2px");
            svg.select(".tooltip")
                .style("display", null)
                .append("text")
                .attr("x", x(d.date) + x.bandwidth() / 2)
                .attr("y", y(d.volume))
                .attr("dy", -5)
                .attr("text-anchor", "middle")
                .text(formatValue(Math.round(d.volume, 0)));

        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("stroke", "none");
            svg.select(".tooltip")
                .style("display", "none")
                .selectAll("text").remove();

        });
    // add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("class", "componentTitle")
        .text("Trade volume forecast");

    // add y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)translate(" + (-height/2) + "," + (-margin.right - 15) + ")")
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Volume");
    
    // add x axis label
    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 5) + ")")
        .style("text-anchor", "middle")
        .text("Date");
    
    // format x axis tick labels
    // svg.selectAll(".tick text")
    //     .attr("transform", "translate(0,10)rotate(45)")
    //     .style("text-anchor", "start");

    // add legend
    var legend = svg.selectAll(".legend")
        .data(["Predicted", "Actual"])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return d == "Predicted" ?"#f85701" : "#0190f8"; });
    
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
    
    // svg.select(".x.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    // svg.select(".x.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    // svg.select(".y.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    // svg.select(".y.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
    
}