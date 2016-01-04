import L from 'leaflet';
import '../temp/Google'; // TODO: Fix when Google repo is compatible with Leaflet 1.0

export const GoogleLayer = L.Google.extend({

    options: {
        style: 'ROADMAP',
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
        script.src = 'http://maps.googleapis.com/maps/api/js?callback=' + callbackFunc;
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


