console.log('viz.js loaded');

getNftCollection = function() {
    dropdown = document.getElementById('nftCollection');
    console.log(dropdown.value);
    const request = new XMLHttpRequest();
    request.open('GET', '/data/get_all/' + dropdown.value, true);
    request.addEventListener('load', function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            const data = JSON.parse(request.responseText);
            console.log(data);
        } else {
            // We reached our target server, but it returned an error
            console.log('error');
        }
    }
    );
    request.send();
}