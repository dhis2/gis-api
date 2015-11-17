import L from '../../src';

L.Icon.Default.imagePath = '/images';

var map = L.map('map').setView([8.577168, -11.871005], 8);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

fetch('/data/sierraleone.json')
    .then(response => response.json())
    .then(addCluster)
    .catch(ex => console.log('parsing failed', ex));

const createMarker = (d) => L.marker(d.co).bindPopup(d.na);
const addLayerToMap = layer => map.addLayer(layer);

function flipCoordinates(data) {
    data.co.reverse();
    return data;
}

function createClusterGroupFromMarkers(clusterGroup, marker) {
    clusterGroup[0].addLayer(marker);
    return clusterGroup;
}

function addCluster(data) {
    data
        .map(flipCoordinates)
        .map(createMarker)
        .reduce(createClusterGroupFromMarkers, [new L.MarkerClusterGroup()])
        .forEach(addLayerToMap);
}
