import {Districts} from './Districts';
import {linear} from 'd3-scale';

export const Choropleth = Districts.extend({

    options: {
        style: {
            color: '#333',
            weight: 1,
            fillOpacity: 0.8,
        },
        colorRange: ['#FFEDA0', '#800026'],
    },

    initialize(options = {}) {
        Districts.prototype.initialize.call(this, options);
        this.setFeatureData(options.data);
    },

    addFeatures(features) {
        Districts.prototype.addFeatures.call(this, features);
        this.addFeatureData(this._data);
    },

    setFeatureData(data) {
        if (typeof data === 'string') { // URL
            this.loadFeatureData(data);
        } else if (typeof features === 'object') {
            this.addFeatureData(data);
        }
    },

    loadFeatureData(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addFeatureData.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addFeatureData(data) {
        if (data) {
            this._data = data;

            if (data && this._geojson) {
                this._data = this._parseData(data);

                this.eachLayer(layer => {
                    layer.bindLabel(layer.feature.properties.na + ' ' + this._data[layer.feature.id], {
                        direction: 'auto',
                    });
                });

                this.setStyle(feature => ({
                    fillColor: this._scale(this._data[feature.id]),
                }));
            }
        }
    },

    _parseData(data) {
        const dataObj = {};
        const values = [];
        let value;

        data.rows.forEach(d => {
            value = Number(d[2]);
            values.push(value);
            dataObj[d[1]] = value;
        });

        values.sort((a, b) => a - b);

        this._scale = linear().domain([values[0], values[values.length - 1]]).range(this.options.colorRange);

        return dataObj;
    },

});

export default function choropleth(options) {
    return new Choropleth(options);
}
