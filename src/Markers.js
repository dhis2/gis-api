import {GeoJSON} from './GeoJSON';
import marker from './Marker';

export const Markers = GeoJSON.extend({

    options: {
        highlightStyle: false,
        markerOptions: {
            riseOnHover: true,
        },
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);

        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        this._layers = {};
        this._icons = {};

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
        const iconProperty = this.options.iconProperty;
        const markerOptions = L.extend({}, this.options.markerOptions);

        if (iconProperty && feature.properties[iconProperty]) {
            markerOptions.icon = L.icon(feature.properties[iconProperty]);
        }

        return marker(latlng, markerOptions);
    },

});

export default function markers(options) {
    return new Markers(options);
}
