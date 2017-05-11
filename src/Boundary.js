// Boundary layer

import L from 'leaflet';
import { GeoJson } from './GeoJson';

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

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }
        GeoJson.prototype.initialize.call(this, options);
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

export default function boundary(options) {
    return new Boundary(options);
}
