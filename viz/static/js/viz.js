console.log('viz.js loaded');

getNftCollection = function() {
    dropdown = document.getElementById('nftCollection');
    console.log(dropdown.value);
    d3.select("#components").selectAll("*").remove();
    if( dropdown.value == ""){
        return;
    }
    const request = new XMLHttpRequest();
    request.open('GET', '/data/get_all/' + dropdown.value, true);
    request.addEventListener('load', function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            const data = JSON.parse(request.responseText);
            console.log(data);
            //remove previous chart
            
            // update the chart
            buildPriceVolumeChart(data.price_data);
            buildFeatureChart(data.feature_data);
            buildGraph(data.graph_data);
            buildSentimentChart(data.sentiment_data);
            buildWordCloud(data.word_cloud_data);
        } else {
            // We reached our target server, but it returned an error
            console.log('error');
        }
    }
    );
    request.send();

    
}