buildGraphChart = function(data){
    
    var nodes = {};
    var links = [];
    
    data.forEach(function(d) {
        nodes[d.source] = {name: d.source};
        nodes[d.target] = {name: d.target};
        links.push({source: d.source, target: d.target, value: +d.value});
    });

    // calculate degree of each node

    links.forEach(function(link) {
        link.source = nodes[link.source];
        link.target = nodes[link.target];

        link.source.degree =  (link.source.degree || 0) + link.value;
        link.target.degree =  (link.target.degree || 0) + link.value;
        link.source.unique_degree =  (link.source.unique_degree || 0) + 1;
        link.target.unique_degree =  (link.target.unique_degree || 0) + 1;x
    });

    // sort nodes by degree, descending
    nodes = d3.values(nodes);
    nodes.sort(function(a, b) { return b.degree - a.degree; });
    var threshold = nodes[100].degree;
    console.log("max degree: ", nodes[0].degree);
    nodes = nodes.filter(function(d) { return d.degree >= threshold; });
    links = links.filter(function(d) { return d.source.degree >= threshold && d.target.degree >= threshold; });

    graph = {nodes: nodes, links: links};
    console.log(graph.nodes.length);
    
    
    // margins
    var margin = {top: 40, right: 40, bottom: 60, left: 80},
        width = 720 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    // draw svg
    var svg = d3.select("#components").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 15 - (margin.top / 2))
        .attr("class", "componentTitle")
        .text("Buyer-Seller Network");
    // draw network
    
    var radius = d3.scaleSqrt()
        .domain([0, d3.max(graph.nodes, function(d) { return d.degree; })])
    .range([0, 20]);

    var simulation = d3.forceSimulation()
    .force("link", 
           d3.forceLink().id(function(d) { return d.name; })
           	.distance(function(d) { return d3.min([d.source.degree, d.target.degree, 100]) * 2; })
          .strength(function(d) {return 0.5; })
          )
    .force("charge", function(d) { return d.degree > 100 ? 20 : -75; })
		// .force("collide", d3.forceCollide().radius(function(d) { return radius(d.degree / 10) + 1; }))
    .force("center", d3.forceCenter(width / 2, height / 2));
        

    var link = svg.append("g")
    .attr("class", "links")
    .selectAll("path")
    .data(graph.links)
    .enter().append("svg:path")
    .attr("stroke-width", function(d) { return d.source.unique_degree * 0.001 });

    link.style('fill', 'none')


    var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")
    .style('transform-origin', '50% 50%')
    .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");

    focus.append("rect")
    .attr("id", "transaction_rect")
    .attr("class", "tooltip")
    .attr("width", 200)
    .attr("height", 75)
    .attr("x", -50)
    .attr("y", -25)
    .attr("rx", 10)
    .attr("ry", 10)

    focus.append("text")
    .attr("id", "transactions")
    .style("color", "black")
    .style("font-size", "12px")
    .attr("x", -40)
    .attr("y", -5)


    focus.append("text")
    .attr("id", "unique_transactions")
    .style("color", "black")
    .style("font-size", "12px")
    .attr("x", -40)
    .attr("y", 15)


    


    //color scale
    var color  = d3.scaleQuantize().domain(d3.extent(graph.nodes, (d)=>d.unique_degree)).range(
      ['#f7fcfd','#e5f5f9','#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#006d2c','#00441b']
    );

    node.append('circle')
        .attr("r", function(d) {return radius(d.degree); })
        .style("fill", function(d) { return color(d.unique_degree); })
        .on("mouseover", function(d) {
            d3.select(this).style("stroke", "gold");
            d3.select(this).style("stroke-width", "2px");
            focus.attr("transform", "translate(" + (d.x -50) + "," + (d.y - 50) + ")");
            focus.style("display", null);
            focus.select("#transactions").text("Number of Transactions: " + d.degree);
            focus.select("#unique_transactions").text("Number of Unique Transactions: " + d.unique_degree);

        })
        .on("mouseout", function(d) {
            d3.select(this).style("stroke", "black");
            d3.select(this).style("stroke-width", "1px");
            focus.style("display", "none");
        });
        // .attr("fill", function(d) { return color(d.group); })

    
        simulation
        .nodes(graph.nodes)
        .on("tick", ticked);
  
    simulation.force("link")
        .links(graph.links);
  
    function ticked() {
      link.attr("d", function(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
          return "M" + 
              d.source.x + "," + 
              d.source.y + "A" + 
              dr + "," + dr + " 0 0,1 " + 
              d.target.x + "," + 
              d.target.y;
      });
      
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}