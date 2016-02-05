import {GeoJson} from './GeoJson';

export const Choropleth = GeoJson.extend({

    options: {
        style: {
            color: '#FFF',
            weight: 1,
            fillOpacity: 0.8,
        },
        highlightStyle: {
            weight: 2,
        },
        valueKey: 'value',
        colorKey: 'color',
        radiusKey: 'radius',
    },

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        GeoJson.prototype.initialize.call(this, options);
    },

    addLayer(layer) {
        const color = layer.feature.properties[this.options.colorKey];
        const radius = layer.feature.properties[this.options.radiusKey];

        if (color && layer.setStyle) {
            layer.setStyle({
                fillColor: color,
            });
        }

        if (radius && layer.setRadius) {
            layer.setRadius(radius);
        }

        GeoJson.prototype.addLayer.call(this, layer);
    },

    // Higlight feature based on id
    highlight(id) {
        const layer = this.findById(id);

        this.removeHighlight();

        if (layer) {
            this._highlight = layer.setStyle({
                weight: 3,
                fillOpacity: 1,
            });
            return layer;
        }
    },

    // Remove highlight from feature
    removeHighlight() {
        if (this._highlight) {
            this._highlight.setStyle({
                weight: 1,
                fillOpacity: 0.8,
            });
        }
    },

    pointToLayer(feature, latlng) {
        return L.circleMarker(latlng);
    },

});

export default function choropleth(options) {
    return new Choropleth(options);
}
