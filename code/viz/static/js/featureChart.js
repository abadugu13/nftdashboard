// create positve negative bar chart
buildFeatureChart = function(data) {

    const margin = {top: 60, right: 40, bottom: 60, left: 80},
        width = 960 * 0.75 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // y axis for feature names
    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map(function(d) {
            return d.feature;
        }
        ))
        .padding(0.1);
    // x axis for feature values
    const x = d3.scaleLinear()
        .range([0, width])
        .domain([-1, 1]);
    
    // create svg
    

    const svg = d3.select("#components")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // create bars

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", d => y(d.feature))
        .attr("height", y.bandwidth())
        .attr("x", d => Math.min(x(d.value), x(0)))
        .attr("width", i => Math.abs(x(i.value) - x(0)))
        .attr("fill", d => d.value > 0 ? "#5fa55a" : "#fa5457")
        .attr("stroke-width", "2px")
    
    svg.selectAll("rect")
    .on("mouseover", function(d) {
        d3.select(this)
            .attr("stroke", "#fff")
            .attr("stroke-width", "2px");
            focus.style("display", null);
            focus.attr("transform", "translate(" + x(d.value) + "," + y(d.feature) + ")");
            focus.select(".tooltip-text").text(d.feature + ": " + d.value);

    })
    .on("mouseout", function(d) {
        d3.select(this)
            .attr("stroke", "none");
        focus.style("display", "none");
    })
    


    
    //x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    
    //title
    svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 20 - (margin.top / 2))
    .attr("class", "componentTitle")
        .text("Feature Importance");

    svg.select(".x.axis").selectAll(".tick").selectAll("text").attr("fill", "#fff");
    svg.select(".x.axis").selectAll(".tick").selectAll("line").attr("stroke", "#fff");

    //tooltip
    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");
    
    focus.append("rect")
        .attr("class", "tooltip")
        .attr("x", -60)
        .attr("y", -30)
        .attr("width", 120)
        .attr("height", 30)
    
    focus.append("text")
        .attr("class", "tooltip-text")
        .attr("x", -50)
        .attr("y", -10)
    

    svg.append("g")
    .attr("id", "labels")
    .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => d.value > 0 ? x(0) - 10 : x(0) + 5)
        .attr("y", d => y(d.feature))
        .attr("dx", 5)
        .attr("dy", y.bandwidth() / 2)
        .attr("text-anchor", d => d.value > 0 ? "end" : "start")
        .style("font-size", "12px")
        .text(d => d.feature);





    



}