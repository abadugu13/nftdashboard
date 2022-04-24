buildAnomalyChart = function(chartData) {

    const margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 960 * 0.75 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
parseDate = d3.timeParse("%Y-%m-%d");
// set anomaly based on threshold
var threshold = 0.5;
chartData.forEach(function(d, i) {
    d.index = i;
    d.anomaly_score = d.anomaly > threshold ? 1 : 0;
    d.date = parseDate(d.date);
})



// set up the scales
var xScale = d3.scaleTime()
    .domain(d3.extent(chartData, function(d) {
        return d.date;
    }
    ))
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, function(d) {
        return d.anomaly;
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
        return yScale(d.anomaly);
    }
    );
// line only defined when points before and after are not anomalous

line.defined(function(d, i){
    return !d.anomaly_score || chartData[i-1] && chartData[i-1].anomaly_score || chartData[i+1] && chartData[i+1].anomaly_score
})

// set up anomalus line
var anomaly_line =d3.line()
.x(function(d) {
    return xScale(d.date);
}
)
.y(function(d) {
    return yScale(d.anomaly);
}
);
anomaly_line.defined(function(d){
    return d.anomaly_score
})
// mark the anomaly points
var anomalyMarker = d3.symbol()
    .type(d3.symbolCircle)
    .size(function(d) {
        return d.anomaly * 10;
    }
    );

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
    .datum(chartData)
    .attr("class", "volume")
    .attr("d", line)

svg.append("path")
    .datum(chartData)
    .attr("class", "line")
    .attr("id", "anomaly_line")
    .style("stroke", "#FF6961")
    .attr("d", anomaly_line)
    .on("mouseover",  function(d) {
        d3.select(this)
            .style("stroke-width", "4px")
    })
    .on("mouseout", function(d){
        d3.select(this)
            .style("stroke-width", "2px")
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

}
