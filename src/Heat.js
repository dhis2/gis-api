import L from 'leaflet';
import '../temp/leaflet.heat'; // TODO: Load as NPM module when Leaflet 1.0 is released

export const Heat = L.HeatLayer.extend({

    options: {
        radius: 25,
        maxZoom: 12,
    },

    initialize(opts) {
        const options = L.setOptions(this, opts);

        L.HeatLayer.prototype.initialize.call(this, [], options);

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
            this.setLatLngs(data.map(d => d.co.reverse()));
        }
    },

});

export default function heat(options) {
    return new Heat(options);
}
