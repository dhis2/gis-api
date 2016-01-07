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

        if (options.data) {
            this.addData(options.data);
        }
    },

    pointToLayer(feature, latlng) {
        const iconProperty = this.options.iconProperty;
        const markerOptions = L.extend({}, this.options.markerOptions);

        if (this.options.label) {
            markerOptions.label = L.Util.template(this.options.label, feature.properties);
            markerOptions.labelStyle = this.options.labelStyle;
        }

        if (iconProperty && feature.properties[iconProperty]) {
            markerOptions.icon = L.icon(feature.properties[iconProperty]);
        }

        return marker(latlng, markerOptions);
    },

});

export default function markers(options) {
    return new Markers(options);
}
