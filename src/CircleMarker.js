// Creates a circle marker from a GeoJSON feature
// Used for dots, client and server cluster

import L from 'leaflet';

export const CircleMarker = L.CircleMarker.extend({

    options: {
        strokeColor: '#fff',
        weight: 0.5,
        radius: 6,
    },

    initialize(feature, opts) {
        const options = L.setOptions(this, opts);

        options.fillColor = options.color;
        options.fillOpacity = options.opacity;
        options.color = options.strokeColor;

        this._feature = feature;
        this._latlng = L.GeoJSON.coordsToLatLng(feature.geometry.coordinates);
        this._radius = this.options.radius;
    },

    getFeature() {
        return this._feature;
    },

    showPopup(content) {
        const popup = content || this.options.popup;
        if (typeof popup === 'string') { // Template string
            this.bindPopup(L.Util.template(popup, this._feature.properties)).openPopup();
        } else if (popup instanceof Function) { // Function returning string
            popup(this._feature, L.bind(function show(response) {
                this.bindPopup(response).openPopup();
            }, this));
        }
    },

    setOpacity(opacity) {
        this.setStyle({
            opacity,
            fillOpacity: opacity,
        });
    },

});

export default function circleMarker(feature, options) {
    return new CircleMarker(feature, options);
}
