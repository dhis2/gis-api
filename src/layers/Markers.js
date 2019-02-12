import L from 'leaflet';
import {GeoJson} from './GeoJson';
import {FeatureGroup} from './FeatureGroup';
import {Circles} from './Circles';

// Markers with label support
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

        if (this.options.pane) {
            markerOptions.pane = this.options.pane;
        }

        if (this.options.label) {
            markerOptions.label = L.Util.template(this.options.label, feature.properties);
            markerOptions.labelStyle = this.options.labelStyle;
        }

        if (iconProperty && feature.properties[iconProperty]) {
            markerOptions.icon = L.icon(feature.properties[iconProperty]);
        }

        return L.marker(latlng, markerOptions);
    },

    setOpacity(opacity) {
        this.eachLayer((layer) => {
            layer.setOpacity(opacity);
        });
    },

    // Higlight marker with pulsing circle
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

    // Remove highlight behind marker
    removeHighlight() {
        if (this._highlight) {
            this._map.removeLayer(this._highlight);
        }
    },

});

export const MarkersGroup = FeatureGroup.extend({

    initialize(options = {}) {
        FeatureGroup.prototype.initialize.call(this, null, options);

        if (options.buffer) {
            this.addLayer(new Circles({
                pane: `${options.pane}-buffer`,
                radius: options.buffer,
                highlightStyle: false,
                data: options.data,
            }));
        }

        this.addLayer(new Markers(options));
    },

});


export default function markers(options) {
    // return new Markers(options);
    return new MarkersGroup(options);
}
