# DHIS 2 GIS API
Various Leaflet extensions to meet the mapping needs of the DHIS 2 platform. 

Leaflet documentation:
http://leafletjs.com/reference-1.0.0.html

## How to use? 

```
import d2map from 'gis-api/src/';
```

d2map is the same as [L.map](http://leafletjs.com/reference.html#map-class), with som extended features (more features will come!):
https://github.com/dhis2/gis-api/blob/master/src/Map.js

```
const map = d2map('map');

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


# Report an issue

The issue tracker can be found in [DHIS2 JIRA](https://jira.dhis2.org)
under the [LIBS](https://jira.dhis2.org/projects/LIBS) project.

Deeplinks:

-   [Bug](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10006&components=11014)
-   [Improvement](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10002&components=11014)
-   [Task](https://jira.dhis2.org/secure/CreateIssueDetails!init.jspa?pid=10700&issuetype=10003&components=11014)
