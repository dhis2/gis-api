import L from 'leaflet';

// Used in boundary layer, choropleth,

// Text label
export const Label = L.Marker.extend({

    options: {
        html: 'Label',
        className: 'leaflet-div-label',
        iconSize: null,
    },

    initialize(latlng, opts) {
        const options = L.setOptions(this, opts);
        this._latlng = L.latLng(latlng);
        options.icon = L.divIcon(options);
    },

    onAdd(map) {
        L.Marker.prototype.onAdd.call(this, map);

        const options = this.options;
        const iconDiv = this._icon;

        if (options.labelStyle) {
            L.extend(iconDiv.style, options.labelStyle);
        }

        // Center div
        iconDiv.style.marginLeft = '-' + (iconDiv.offsetWidth / 2) + 'px';

        if (options.position !== 'below') {
            iconDiv.style.marginTop = '-' + (iconDiv.offsetHeight / 2) + 'px';
        }
    },
});

export default function label(latlng, options) {
    return new Label(latlng, options);
}
