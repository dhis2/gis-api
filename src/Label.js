// Used in boundary layer, choropleth,

import L from 'leaflet';

// Text label
export const Label = L.Marker.extend({

    options: {
        html: 'Label',
        className: 'leaflet-div-label',
        iconSize: [160, 16],
    },

    initialize(latlng, opts) {
        const options = L.setOptions(this, opts);
        this._latlng = L.latLng(latlng);
        options.icon = L.divIcon(options);
    },

    onAdd(map) {
        L.Marker.prototype.onAdd.call(this, map);

        if (this.options.labelStyle) {
            L.extend(this._icon.style, this.options.labelStyle);
        }
    },

});

export default function label(latlng, options) {
    return new Label(latlng, options);
}
