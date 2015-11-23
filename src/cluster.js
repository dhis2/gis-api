import L from 'leaflet';
// import 'leaflet.markercluster';
import '../temp/leaflet.markercluster-fix'; // TODO: Remove when cluster repo is compatible with Leaflet 1.0

export const Cluster = L.MarkerClusterGroup.extend({

    options: {
        zoomToClusterBounds: true,
        polygonOptions: {
            weight: 1,
        },
    },

    initialize(opts) {
        const options = L.setOptions(this, opts);
        L.MarkerClusterGroup.prototype.initialize.call(this, options);

        if (typeof options.data === 'string') { // URL
            this.loadData(options.data);
        } else {
            this.addData(options.data);
        }
    },

    // Load DHIS2 data
    loadData(url) {
        fetch(url)
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

export default function cluster(options) {
    return new Cluster(options);
}
