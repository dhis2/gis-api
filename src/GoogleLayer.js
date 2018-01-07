// Extending https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant
// Handles Google API loading

// import L from 'leaflet';
import '../node_modules/leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';

export const GoogleLayer = L.GridLayer.GoogleMutant.extend({

    options: {
        style: 'ROADMAP', // ROADMAP, SATELLITE, HYBRID, TERRAIN
        version: '3.30',  // Google Maps API version
        apiKey: 'AIzaSyBjlDmwuON9lJbPMDlh_LI3zGpGtpK9erc', // Google Maps API key (should be overridden)
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);

        options.type = options.style.toLowerCase();

        // Load Google Maps API if not already loaded/loading
        if (!this.googleMapsApiLoaded() && !GoogleLayer._mapsApiLoading) {
            this.loadGoogleMapsApi();
        }

        L.GridLayer.GoogleMutant.prototype.initialize.call(this);
    },

    // Set opacity only works if map layer is redrawn
    setOpacity(opacity) {
        if (opacity !== this.options.opacity) {
            this.options.opacity = opacity;
            this.onRemove(this._map);
            this.onAdd(this._map);
        }
    },

    onAdd(map) {
        L.DomUtil.addClass(map.getContainer(), 'leaflet-google'); // Used to move scale control
        L.GridLayer.GoogleMutant.prototype.onAdd.call(this, map);
    },

    onRemove(map) {
        L.DomUtil.removeClass(map.getContainer(), 'leaflet-google');
        L.GridLayer.GoogleMutant.prototype.onRemove.call(this, map);
    },

    // Check if Google Maps API is loaded
    googleMapsApiLoaded() {
        return (typeof google !== 'undefined' && typeof google.maps !== 'undefined');
    },

    // Loading of Google Maps API
    loadGoogleMapsApi() {
        GoogleLayer._mapsApiLoading = true;

        const script = document.createElement('script');
        script.src = `//maps.googleapis.com/maps/api/js?key=${this.options.apiKey}&v=${this.options.version}`;
        document.getElementsByTagName('head')[0].appendChild(script);
    },

});

export default function googleLayer(options) {
    return new GoogleLayer(options);
}
