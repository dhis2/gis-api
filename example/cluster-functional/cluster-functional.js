import L from '../../src';

function map() {
    if (!map.map) {
        L.Icon.Default.imagePath = '/images';
        map.map = L.map('map').setView([8.577168, -11.871005], 8);
    }

    return map.map;
}

function getMapQuest() {
    return L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
        subdomains: '1234',
        attribution: '&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" title="ODbL">open license</a>. Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    });
}

function getOpenStreetMap() {
    return L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    });
}

function getGoogleMap() {
    return new L.Google('ROADMAP');
}

function createMaps(response) {
    const maps = {
        'MapQuest': getMapQuest().addTo(map()),
        'OpenStreetMap': getOpenStreetMap(),
        'Google Maps': getGoogleMap(),
    };

    return [response, maps];
}

const createMarker = orgUnit => L.marker(orgUnit.co).bindPopup(orgUnit.na);
const addLayerToMap = layer => {
    map().addLayer(layer);
    return layer;
};

function flipCoordinates(data) {
    data.co.reverse();
    return data;
}

function createClusterGroupFromMarkers(clusterGroup, marker) {
    clusterGroup.addLayer(marker);
    return clusterGroup;
}

function addCluster(data) {
    return data
        .map(flipCoordinates)
        .map(createMarker)
        .reduce(createClusterGroupFromMarkers, new L.MarkerClusterGroup());
}

fetch('/data/sierraleone.json')
    .then(response => response.json())
    .then(createMaps)
    .then(([response, maps]) => {
        const clusterLayer = addCluster(response);

        L.control
            .layers({...maps}, {Clusters: clusterLayer})
            .addTo(map());

        addLayerToMap(clusterLayer);
    })
    .catch(ex => console.log('parsing failed', ex));
