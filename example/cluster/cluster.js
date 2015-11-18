import L from '../../src';

L.Icon.Default.imagePath = '/images';

let map = L.map('map').setView([8.577168, -11.871005], 8);

let mapquest = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
    subdomains: '1234',
    attribution: '&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" title="ODbL">open license</a>. Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
}).addTo(map);

let osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

let google = new L.Google('ROADMAP');

let cluster = L.dhis2.cluster('/data/sierraleone.json').addTo(map);

let layerControl = L.control.layers({
    'MapQuest': mapquest,
    'OpenStreetMap': osm,
    'Google Maps': google,
}, {
    'Cluster': cluster,
}).addTo(map);