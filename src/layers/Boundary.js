import L from 'leaflet';
import { GeoJson } from './GeoJson';
import { FeatureGroup } from './FeatureGroup';
import { LabelGroup } from './LabelGroup';

// Boundary layer
export const Boundary = GeoJson.extend({

    options: {
        style: {
            opacity: 1,
            fillOpacity: 0,
            fill: false,
            radius: 5,
        },
        highlightStyle: {
            weight: 3,
        },
    },

    addLayer(layer) {
        const prop = layer.feature.properties;

        if (prop.style) {
            layer.setStyle(prop.style);
        }

        GeoJson.prototype.addLayer.call(this, layer);
    },

    // Set opacity for all features
    setOpacity(opacity) {
        this.setStyle({
            opacity,
        });
    },

    // Use circle markers for point features
    pointToLayer(geojson, latlng) {
        this.options.style.pane = this.options.pane;
        return new L.CircleMarker(latlng, this.options.style);
    },

    // Higlight feature based on id
    highlight(id) {
        const layer = this.findById(id);

        this.removeHighlight();

        if (layer) {
            this._highlight = layer.setStyle({
                fillOpacity: 0.5,
            });
            return layer;
        }
    },

    // Remove highlight from feature
    removeHighlight() {
        if (this._highlight) {
            this._highlight.setStyle({
                fillOpacity: 0,
            });
        }
    },

});

// Boundary layer with labels
export const BoundaryGroup = FeatureGroup.extend({
    initialize(options = {}) {
        FeatureGroup.prototype.initialize.call(this, null, options);

        this.addLayer(new Boundary(options));
        this.addLabels();
    },
});

export default function boundary(options) {
    return new BoundaryGroup(options);
}
