/*
 Extending Leaflet.markercluster to support DHIS 2 data
 https://github.com/Leaflet/Leaflet.markercluster
 */

import L from 'leaflet';
// import 'leaflet.markercluster';
import '../temp/leaflet.markercluster-fix'; // TODO: Remove when cluster repo is compatible with Leaflet 1.0

export const Cluster = L.MarkerClusterGroup.extend({

    options: {
        zoomToClusterBounds: true
    },

    initialize: function (data, options) {
        options = L.setOptions(this, options);
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
            }).then(this.addData.bind(this)).catch(function(ex) {
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

export default function cluster(data, options) {
    return new Cluster(data, options);
};
