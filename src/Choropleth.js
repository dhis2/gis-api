import {Features} from './Features';
import {linear} from 'd3-scale';

export const Choropleth = Features.extend({

    options: {
        style: {
            color: '#333',
            weight: 1,
            fillOpacity: 0.8,
        },
        highlightStyle: {
            weight: 3,
        },
        colorRange: ['#FFEDA0', '#800026'],
        valueKey: 'value',
        noDataValue: -9999,
    },

    onAdd(map) {
        this._minValue = null;
        this._maxValue = null;

        Features.prototype.onAdd.call(this, map);
    },

    // Change min and max values on layer add
    addLayer(layer) {
        const options = this.options;
        const value = layer.feature.properties[options.valueKey];

        if (value !== options.noDataValue) {
            if (this._minValue === null || value < this._minValue) {
                this._minValue = value;
            }

            if (this._maxValue === null || value > this._maxValue) {
                this._maxValue = value;
            }
        }

        Features.prototype.addLayer.call(this, layer);
    },

    // Add features and set styles
    addFeatures(geojson) {
        Features.prototype.addFeatures.call(this, geojson);

        if (this._minValue !== null && this._maxValue !== null) {
            const scale = linear().domain([this._minValue, this._maxValue]).range(this.options.colorRange);

            this.setStyle(feature => {
                return {
                    fillColor: scale(feature.properties.value),
                };
            });
        }
    },

});

export default function choropleth(options) {
    return new Choropleth(options);
}
