// Extending https://github.com/shramov/leaflet-plugins/blob/master/layer/tile/Google.js
// Handles Google API loading

import L from 'leaflet';
import '../temp/Google'; // TODO: Fix when Google repo is compatible with Leaflet 1.0

export const GoogleLayer = L.Google.extend({

    options: {
        style: 'ROADMAP', // ROADMAP, SATELLITE, HYBRID, TERRAIN
        version: '3.22',  // Google Maps API version
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);

        this._type = options.style;

        if (this.googleMapsApiLoaded()) {
            this._ready = google.maps.Map !== undefined;
            if (!this._ready) L.Google.asyncWait.push(this);
        } else {
            this.loadGoogleMapsApi();
        }
    },

    onAdd(map, insertAtTheBottom) {
        this._map = map;
        this._insertAtTheBottom = insertAtTheBottom;

        // Add to map if Google Maps API is loaded
        if (this.googleMapsApiLoaded()) {
            L.Google.prototype.onAdd.call(this, map, insertAtTheBottom);
        }

        L.DomUtil.addClass(map.getContainer(), 'leaflet-google');
    },

    onRemove(map) {
        L.DomUtil.removeClass(map.getContainer(), 'leaflet-google');
        L.Google.prototype.onRemove.call(this, map);
    },

    // Check if Google Maps API is loaded
    googleMapsApiLoaded() {
        return (typeof google !== 'undefined' && typeof google.maps !== 'undefined');
    },

    // Async loading of Google Maps API
    loadGoogleMapsApi() {
        // Create random callback function
        const callbackFunc = 'onGoogleMapsApiReady_' + (Math.random() + 1).toString(36).substring(7);

        // Bind global callback to this instance
        window[callbackFunc] = this.onGoogleMapsApiLoad.bind(this);

        const script = document.createElement('script');
        script.src = `//maps.googleapis.com/maps/api/js?v=${this.options.version}&callback=${callbackFunc}`;
        document.getElementsByTagName('head')[0].appendChild(script);
    },

    // Add to map when Google Maps API is loaded
    onGoogleMapsApiLoad() {
        this._ready = true;
        if (this._map) {
            this.onAdd(this._map, this._insertAtTheBottom);
        }
    },

});

export default function googleLayer(options) {
    return new GoogleLayer(options);
}
