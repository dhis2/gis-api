// Thematic layer

import {GeoJson} from './GeoJson';
import label from './Label';

export const Choropleth = GeoJson.extend({

    options: {
        style: {
            color: '#333',
            weight: 1,
            fillOpacity: 0.8,
        },
        highlightStyle: {
            weight: 3,
        },
        valueKey: 'value',
        colorKey: 'color',
        radiusKey: 'radius',
    },

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }
        this._labels = L.layerGroup();
        GeoJson.prototype.initialize.call(this, options);
    },

    addLayer(layer) {
        const prop = layer.feature.properties;
        const color = prop[this.options.colorKey];
        const radius = prop[this.options.radiusKey];

        if (color && layer.setStyle) {
            layer.setStyle({
                fillColor: color,
            });
        }

        if (radius && layer.setRadius) {
            layer.setRadius(radius);
        }

        // Add text label
        if (this.options.label) {
            const labelStyle = L.extend(prop.labelStyle || {}, this.options.labelStyle);
            const latlng = (layer.getBounds ? layer.getBounds().getCenter() : layer.getLatLng());

            layer._label = label(latlng, {
                html: L.Util.template(this.options.label, prop),
                labelStyle: labelStyle,
            });

            this._labels.addLayer(layer._label);
        }

        GeoJson.prototype.addLayer.call(this, layer);
    },

    // Higlight feature based on id
    highlight(id) {
        const layer = this.findById(id);

        this.removeHighlight();

        if (layer) {
            this._highlight = layer.setStyle(this.options.highlightStyle);
            return layer;
        }
    },

    removeHighlight() {
        if (this._highlight) {
            this._highlight.setStyle(this.options.resetStyle);
        }
    },

    pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
            pane: this.options.pane,
        });
    },

    // Add labels
    onAdd(map) {
        map.addLayer(this._labels);
        GeoJson.prototype.onAdd.call(this, map);
    },

    // Roemove labels
    onRemove(map) {
        map.removeLayer(this._labels);
        GeoJson.prototype.onRemove.call(this, map);
    },

});

export default function choropleth(options) {
    return new Choropleth(options);
}
