import L from 'leaflet';
// import 'leaflet.markercluster';
import '../temp/leaflet.markercluster-fix'; // TODO: Remove when cluster repo is compatible with Leaflet 1.0

export const Cluster = L.MarkerClusterGroup.extend({

    options: {
        zoomToClusterBounds: true,
    },

    initialize(data, options) {
        const mapOptions = L.setOptions(this, options);
        L.MarkerClusterGroup.prototype.initialize.call(this, mapOptions);

        if (typeof data === 'string') { // URL
            this.loadData(data);
        } else {
            this.addData(data);
        }
    },

    // Load DHIS2 data
    loadData(url) {
        fetch(url) // http://mts.io/2015/04/08/webpack-shims-polyfills/
            .then(response => response.json())
            .then(this.addData.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    // Add DHIS2 data
    addData(data) {
        if (data) { // Create markers from data
            this.addLayers(data.map(d => L.marker(d.co.reverse()).bindPopup(d.na)));
        }
    },

});

export default function cluster(data, options) {
    return new Cluster(data, options);
}
