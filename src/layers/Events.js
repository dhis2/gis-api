import L from 'leaflet';
import { GeoJson } from './GeoJson';
import { FeatureGroup } from './FeatureGroup';

// Events and Tracked Entities layer 
export const Events = GeoJson.extend({

    options: {
        style: {
            color: '#333',
            fillColor: '#ccc',
            fillOpacity: 0.8,
            weight: 1,
        },
        highlightStyle: {
            weight: 3,
        },
        valueKey: 'value',
        colorKey: 'color',
        radiusKey: 'radius',
    },

    addLayer(layer) {
        const feature = layer.feature;
        const prop = feature.properties;
        const color = prop[this.options.colorKey];
        const radius = prop[this.options.radiusKey];

        if (color && layer.setStyle) {
            layer.setStyle({
                fillColor: color,
            });
        }

        if (feature.isSelected) {
            layer.setStyle(this.options.highlightStyle);
        }

        if (radius && layer.setRadius) {
            layer.setRadius(radius);
        }

        GeoJson.prototype.addLayer.call(this, layer);
    },

    // Highlight feature based on id
    highlight(id) {
        const layer = this.findById(id);

        if (layer) {
            return layer.setStyle(this.options.highlightStyle);
        }
    },

    // Remove highlight of feature based on id
    removeHighlight(id) {
        const layer = this.findById(id);

        if (layer) {
            return layer.setStyle(this.options.resetStyle);
        }
    },

    pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
            pane: this.options.pane,
        });
    },

});

// Choropleth layer with labels
export const EventsGroup = FeatureGroup.extend({
    initialize(options) {
        FeatureGroup.prototype.initialize.call(this, options);

        this.addBuffers();
        this.addLayer(new Events(options));
    },
});

export default function events(options) {
    return new EventsGroup(options);
}
