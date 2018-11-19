// Extending https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant
// Handles Google API loading

// import L from 'leaflet';
import '../node_modules/leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant';

export const GoogleLayer = L.GridLayer.GoogleMutant.extend({

    options: {
        style: 'ROADMAP', // ROADMAP, SATELLITE, HYBRID, TERRAIN
        version: '3.35',  // Google Maps API version
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

    setOpacity(opacity) {
        if (opacity !== this.options.opacity) {
            this.options.opacity = opacity;
            if (this.googleMapsApiLoaded()) { // Opacity change only works if map layer is redrawn
                this.onRemove(this._map);
                this.onAdd(this._map);
            }
        }
    },

    onAdd(map) {
        L.DomUtil.addClass(map.getContainer(), 'leaflet-google'); // Used to move scale control
        L.GridLayer.GoogleMutant.prototype.onAdd.call(this, map);

        // Hack to make sure function is called after map plugins is added to the DOM
        setTimeout(() => this._initMutantContainer(), 100);
    },

    onRemove(map) {
        L.DomUtil.removeClass(map.getContainer(), 'leaflet-google');
        // L.GridLayer.GoogleMutant.prototype.onRemove.call(this, map); // See added check below

        // Code below copied from Leaflet.GoogleMutant.js for added check (error when basemaps are switched fast)
        L.GridLayer.prototype.onRemove.call(this, map);
        map._container.removeChild(this._mutantContainer);
        this._mutantContainer = undefined;

        google.maps.event.clearListeners(map, 'idle');

        if (this._mutant) { // Added check
            google.maps.event.clearListeners(this._mutant, 'idle');
        }

        map.off('viewreset', this._reset, this);
        map.off('move', this._update, this);
        map.off('zoomend', this._handleZoomAnim, this);
        map.off('resize', this._resize, this);

        if (map._controlCorners) {
            map._controlCorners.bottomright.style.marginBottom = '0em';
            map._controlCorners.bottomleft.style.marginBottom = '0em';
        }
    },

    // Check if Google Maps API is loaded
    googleMapsApiLoaded() {
        return (typeof google !== 'undefined' && typeof google.maps !== 'undefined'); // eslint-disable-line
    },

    // Loading of Google Maps API
    loadGoogleMapsApi() {
        GoogleLayer._mapsApiLoading = true;

        const script = document.createElement('script'); // eslint-disable-line
        script.src = `//maps.googleapis.com/maps/api/js?key=${this.options.apiKey}&v=${this.options.version}`;
        document.getElementsByTagName('head')[0].appendChild(script); // eslint-disable-line
    },

});

export default function googleLayer(options) {
    return new GoogleLayer(options);
}
