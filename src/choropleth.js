import L from 'leaflet';
import '../temp/leaflet.label-src';
import {linear} from 'd3-scale';

export const Choropleth = L.GeoJSON.extend({

    options: {
        colorRange: ['#FFEDA0', '#800026'],
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        this._layers = {};
        this.setFeatures(options.features);
        this.setFeatureData(options.data);
        this.on('click', this.onClick, this);
    },

    onClick(evt) {
        const layer = evt.layer;
        const popupFunc = this.options.popup;

        if (popupFunc) {
            layer.label.close(); // Hide label

            if (popupFunc.length < 2) { // Sync
                this.addPopup(evt.latlng, popupFunc(layer.feature));
            } else { // Async if callback function
                popupFunc(layer.feature, content => {
                    this.addPopup(evt.latlng, content);
                });
            }
        }
    },

    addPopup(latlng, content) {
        L.popup()
            .setLatLng(latlng)
            .setContent(content)
            .openOn(this._map);
    },

    setFeatures(features) {
        if (typeof features === 'string') { // URL
            this.loadFeatures(features);
        } else if (typeof features === 'object') {
            this.addFeatures(features);
        }
    },

    loadFeatures(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addFeatures.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addFeatures(features) {
        if (features) {
            this._geojson = features;

            if (Array.isArray(features)) {
                this._geojson = this._dhis2geojson(features);
            }

            this.addData(this._geojson);
            this.addFeatureData(this._data);
        }
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
                    color: '#333',
                    weight: 1,
                    fillColor: this._scale(this._data[feature.id]),
                    fillOpacity: 0.8,
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

    _dhis2geojson(features) {
        return {
            type: 'FeatureCollection',
            features: features.map(f => ({
                type: 'Feature',
                id: f.id,
                geometry: {
                    type: 'MultiPolygon',
                    coordinates: JSON.parse(f.co),
                },
                properties: f,
            })),
        };
    },

});

export default function choropleth(options) {
    return new Choropleth(options);
}
