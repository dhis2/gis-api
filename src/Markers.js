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

    addLayer(layer) {
        const options = this.options;
        const feature = layer.feature;

        if (options.label) {
            layer.bindLabel(L.Util.template(options.label, feature.properties));
        }

        if (options.popup) {
            layer.bindPopup(L.Util.template(options.popup, feature.properties));
        }

        L.GeoJSON.prototype.addLayer.call(this, layer);
    },

    pointToLayer(feature, latlng) {
        const options = this.options;

        const markerOptions = {};

        if (options.icon) {
            markerOptions.icon = L.icon(options.icon); // TODO: Reuse icons?
        }

        return L.marker(latlng, markerOptions);
    },

});

export default function markers(options) {
    return new Markers(options);
}
