import L from './index';

var map = L.map('map').setView([8.577168, -11.871005], 8);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//var markers = new L.MarkerClusterGroup();

// http://mts.io/2015/04/08/webpack-shims-polyfills/
fetch('/data/sierraleone.json')
    .then(function(response) {
        return response.json()
    }).then(addCluster).catch(function(ex) {
        console.log('parsing failed', ex)
    });

function addCluster(data) {
    console.log(data);

    //
    /*
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        markers.addLayer(L.marker(d.co.reverse()).bindPopup(d.na));
    }
    map.addLayer(markers);
    */
}



/*
 var markers = new L.MarkerClusterGroup();
 $.getJSON('../data/sierraleone.json', function(data){
 for (var i = 0; i < data.length; i++) {
 var d = data[i];
 markers.addLayer(L.marker(d.co.reverse()).bindPopup(d.na));
 }
 });
 map.addLayer(markers);
 */