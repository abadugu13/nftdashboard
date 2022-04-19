x = function(data) {
    words = {};
    data.forEach(function(d) {
        // count number of times each word appears
        words[d.word] = (words[d.word] || 0) + 1;
    });
    
    const margin = {top: 60, right: 40, bottom: 60, left: 80},
    width = 960 * 0.75 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#components").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
        const wordScale = d3.scaleLinear()
    	.domain([0,75])
    	.range([10,120])
    
    var layout = d3.layout.cloud()
        .size([width, height])
        .timeInterval(20)
        .words(data)
        .rotate(function(d) { return 0; })
        .fontSize(d=>wordScale(d.frequency))
        //.fontStyle(function(d,i) { return fontSyle(Math.random()); })
        .fontWeight(["bold"])
        .text(function(d) { return d.text; })
        .spiral("rectangular") // "archimedean" or "rectangular"
        .on("end", draw)
        .start();

    var wordcloud = svg.append("g")
        .attr('class','wordcloud')
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
        
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .selectAll('text')
    //       .style('fill',function(d) { return color(d); })
    //       .style('font','sans-serif');

    function draw(words) {
        wordcloud.selectAll("text")
            .data(words)
            .enter().append("text")
            .attr('class','word')
    //         .style("fill", function(d, i) { return color(i); })
            .style("font-size", function(d) { return d.size + "px"; })
    //         .style("font-family", function(d) { return d.font; })

            .attr("text-anchor", "middle")
            .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
            .text(function(d) { return d.text; });
    };
  
}


