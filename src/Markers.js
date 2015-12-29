import L from 'leaflet';
import '../temp/leaflet.label-src';

export const Markers = L.GeoJSON.extend({

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);

        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        this._layers = {};

        if (options.data) {
            this.addData(options.data);
        }
    },

    pointToLayer(feature, latlng) {
        const options = this.options;

        const markerOptions = {};

        if (options.icon) {
            markerOptions.icon = L.icon(options.icon); // TODO: Reuse icons?
        }

        const marker = L.marker(latlng, markerOptions);

        if (options.label) {
            marker.bindLabel(L.Util.template(options.label, feature.properties));
        }

        if (options.popup) {
            marker.bindPopup(L.Util.template(options.popup, feature.properties));
        }

        return marker;
    },

});

export default function markers(options) {
    return new Markers(options);
}
