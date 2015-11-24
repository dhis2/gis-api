import L from 'leaflet';

export const Markers = L.FeatureGroup.extend({

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        L.FeatureGroup.prototype.initialize.call(this);

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
            data.forEach(d => this.addLayer(L.marker(d.co.reverse()).bindPopup(d.na)));
        }
    },

});

export default function markers(options) {
    return new Markers(options);
}
