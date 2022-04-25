 
 
 buildWordCloud= function(data) {
    const margin = {top: 60, right: 40, bottom: 60, left: 80},
        width = 960 * 0.75 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    console.log(data);
    var g = d3.select("#components").append("svg")
        .style("border", "3px solid rgba(30, 28, 28, 0.516)")
        .style("border-top", "none")     
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // add title
    g.append("text")
        .attr("x", (width / 2))
        .attr("y", 15 - (margin.top / 2))
        .attr("class", "componentTitle")
        .text("Twitter sentiment - Word cloud");
    // var color = d3.scaleOrdinal(d3.schemeCategory20);
    // d3 sqrt scale for word
    var wordScale = d3.scaleSqrt()
        .domain([1, d3.max(data, function(d) { return d.frequency; })])
        .range([1, 50]);
    
    
    var layout = d3.layout.cloud()
      .size([width, height])
      .timeInterval(20)
      .words(data)
      .rotate(function(d, i) { return i==0?0:~~(Math.random() * 2) * 90; })
      .fontSize(function(d) {return wordScale(d.frequency); })
    //   .fontStyle(function(d,i) { return fontSyle(Math.random()); })
      .fontWeight(["bold"])
      .text(function(d) {return d.text; })
      .spiral("rectangular") // "archimedean" or "rectangular"
      .on("end", draw)
      .start();
    
    console.log(layout.fontSize());

    var wordcloud = g.append("g")
      .attr('class','wordcloud')
      .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
      
    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .selectAll('text')
//       .style('fill',function(d) { return color(d); })
//       .style('font','sans-serif');

    function draw(words) {
        console.log(words);
        wordcloud.selectAll("text")
        .data(words)
        .enter().append("text")
        .attr('class','word')
//         .style("fill", function(d, i) { return color(i); })
        .style("font-size", function(d) { return d.size + "px"; })
//         .style("font-family", function(d) { return d.font; })

        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .text(function(d) {return d.text; });
    };
  
};
  


