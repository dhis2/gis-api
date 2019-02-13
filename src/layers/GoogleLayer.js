import L from "leaflet";
import layerMixin from "./layerMixin";

// Extending https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant
// Handles Google API loading

import "leaflet.gridlayer.googlemutant";

export const GoogleLayer = L.GridLayer.GoogleMutant.extend({
  ...layerMixin,

  options: {
    style: "ROADMAP", // ROADMAP, SATELLITE, HYBRID, TERRAIN
    version: "3.35" // Google Maps API version
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
      if (this.googleMapsApiLoaded()) {
        // Opacity change only works if map layer is redrawn
        this.onRemove(this._map);
        this.onAdd(this._map);
      }
    }
  },

  onAdd(map) {
    L.DomUtil.addClass(map.getContainer(), "leaflet-google"); // Used to move scale control
    L.GridLayer.GoogleMutant.prototype.onAdd.call(this, map);

    // Hack to make sure function is called after map plugins is added to the DOM
    setTimeout(() => this._initMutantContainer(), 100);
  },

  onRemove(map) {
    L.DomUtil.removeClass(map.getContainer(), "leaflet-google");
    L.GridLayer.GoogleMutant.prototype.onRemove.call(this, map); // See added check below
  },

  // Check if Google Maps API is loaded
  googleMapsApiLoaded() {
    return typeof google !== "undefined" && typeof google.maps !== "undefined"; // eslint-disable-line
  },

  // Loading of Google Maps API
  loadGoogleMapsApi() {
    GoogleLayer._mapsApiLoading = true;

    const script = document.createElement("script"); // eslint-disable-line
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      this.options.apiKey
    }&v=${this.options.version}`;
    document.getElementsByTagName("head")[0].appendChild(script); // eslint-disable-line
  }
});

export default function googleLayer(options) {
  return new GoogleLayer(options);
}
