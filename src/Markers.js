import {GeoJson} from './GeoJson';
import marker from './Marker';

export const Markers = GeoJson.extend({

    options: {
        highlightStyle: false,
        markerOptions: {
            riseOnHover: true,
        },
        iconProperty: 'icon',
    },

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        GeoJson.prototype.initialize.call(this, options);
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

    highlight(id) {
        const layer = this.findById(id);

        this.removeHighlight();

        if (layer) {
            this._highlight = L.circleMarker(layer.getLatLng(), {
                radius: 5,
                color: 'orange',
                fillOpacity: 0,
                className: 'leaflet-marker-highlight',
            }).addTo(this._map);

            return layer;
        }
    },

    removeHighlight() {
        if (this._highlight) {
            this._map.removeLayer(this._highlight);
        }
    },

});

export default function markers(options) {
    return new Markers(options);
}
