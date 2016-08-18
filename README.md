# DHIS 2 GIS API
Various Leaflet extensions to meet the mapping needs of the DHIS 2 platform. 

Leaflet documentation:
http://leafletjs.com/reference-1.0.0.html

## How to use? 

```
import d2map from 'dhis2-gis-api/src/';
```

const map = d2map('map', {});

d2map is the same as [L.map](http://leafletjs.com/reference.html#map-class), with som extended features (more features will come!):
https://github.com/dhis2/dhis2-gis-api/blob/master/src/Map.js

```
// Add basemap
L.tileLayer('//cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

// Add place search
L.control.geocoder('mapzenSearchKey', {
    attribution: null,
    panToPoint: null
}).addTo(map);

// Zoom map
map.setView([51.505, -0.09], 13);
```
