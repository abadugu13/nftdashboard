buildAnomalyChart = function(chartData) {

    var volumeData = chartData.volumeData;
    var anomalyData = chartData.anomalyData;
    
    console.log(anomalyData.slice(0, 10));
    anomalyDataParse = d3.timeParse("%-m/%-d/%Y")
    parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
    dateFormatter = d3.timeFormat("%m/%d/%y");

    var anomalyData = anomalyData.map(function(d) {
        return {
            date: anomalyDataParse(d.date),
            volume: d.volume,
        }})
    var volumeData = volumeData.map(function(d) {
        return {
            date: parseDate(d.date),
            volume: d.volume,
        }})    
    const margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 960 * 0.75 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Filter data to only show from 2020
    var anomalyData = anomalyData.filter(function(d) {
        return d.date > new Date("2020-01-01");
    });
    var volumeData = volumeData.filter(function(d) {           
        return d.date > new Date("2020-01-01");
    });


// set up the scales
var xScale = d3.scaleTime()
    .domain(d3.extent(volumeData, function(d) {
        return d.date;
    }
    ))
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(volumeData, function(d) {
        return d.volume;
    }
    )])
    .range([height, 0]);

// set up the axes
var xAxis = d3.axisBottom(xScale)
    .ticks(5);

var yAxis = d3.axisLeft(yScale)
    .ticks(5);

// set up the  main line
var line = d3.line()
    .x(function(d) {
        return xScale(d.date);
    }
    )
    .y(function(d) {
        return yScale(d.volume);
    }
    );
// line only defined when points before and after are not anomalous

// line.defined(function(d, i){
//     return !d.anomaly_score || chartData[i-1] && chartData[i-1].anomaly_score || chartData[i+1] && chartData[i+1].anomaly_score
// })

// set up anomalus line
var anomaly_line =d3.line()
.x(function(d) {
    return xScale(d.date);
}
)
.y(function(d) {
    return yScale(d.volume);
}
);
// anomaly_line.defined(function(d){
//     return d.anomaly_score
// })
// set up the svg


var svg = d3.select("#components").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "anomalyChart")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

svg.append("path")
    .datum(volumeData)
    .attr("class", "volume")
    .attr("d", line)

var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");
focus.append("rect")
    .attr("class", "tooltip")
    .attr("width", 90)
    .attr("height", 30)
    .attr("x", 9)
    .attr("y", -13)
    .attr("fill", "black")

focus.append("text")
    .attr("x", 9)
    .style("font-size", "12px")
    .attr("dy", ".35em");

svg.selectAll("circle")
    .data(anomalyData)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return xScale(d.date);
    })
    .attr("cy", function(d) {
        return yScale(d.volume);
    })
    .style("r", 5)
    .style("fill", "red")
    .style("opacity", 0.5)
    .on("mouseover", function(d) {
        d3.select(this)
            .style("fill", "black")
            .style("opacity", 1)
            .style("stroke", "black")
            .style("stroke-width", "2px")
        focus.style("display", null);
        focus.select("text").text(dateFormatter(d.date) + ": " + d.volume);
        focus.attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.volume) + ")");
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .style("fill", "red")
            .style("opacity", 0.5)
            .style("stroke", "none")
        focus.style("display", "none");
    })



// title
svg.append("text")  
        .attr("x", (width / 2))
        .attr("y", 20 - (margin.top / 2))
        .attr("class", "componentTitle")
        .text("Anomaly Chart");

// svg.select(".x.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
//     svg.select(".x.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");
//     svg.select(".y.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
//     svg.select(".y.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");

// y label

svg.append("text")
        .attr("x", (width / 2))
        .attr("y", height + (margin.bottom / 2))
        .attr("text-anchor", "middle")
        .text("Date");
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -5 - (margin.left / 2))
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Volume");

// tooltip


}
