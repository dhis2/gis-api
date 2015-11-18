/*
 Extending Leaflet.markercluster to support DHIS 2 data
 https://github.com/Leaflet/Leaflet.markercluster
 */

import L from 'leaflet';
// import 'leaflet.markercluster';
import '../temp/leaflet.markercluster-fix'; // TODO: Remove when cluster repo is compatible with Leaflet 1.0

L.dhis2 = L.dhis2 || {};

L.dhis2.Cluster = L.MarkerClusterGroup.extend({

    initialize: function (data, options) {
        L.MarkerClusterGroup.prototype.initialize.call(this, options);

        if (typeof data === 'string') { // URL
            this.loadData(data);
        } else {
            this.addData(data);
        }
    },

    // Load DHIS2 data
    loadData: function (url) {
        fetch(url) // http://mts.io/2015/04/08/webpack-shims-polyfills/
            .then(function(response) {
                return response.json()
            }).then(L.bind(this.addData, this)).catch(function(ex) {
                console.log('parsing failed', ex)
            });
    },

    // Add DHIS2 data
    addData: function (data) {
        if (data) { // Create markers from data
            this.addLayers(data.map(function createMarker(d){
                return L.marker(d.co.reverse()).bindPopup(d.na);
            }));
        }
    },

});

L.dhis2.cluster = function (data, options) {
    return new L.dhis2.Cluster(data, options);
};
