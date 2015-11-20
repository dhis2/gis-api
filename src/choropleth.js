import L from 'leaflet';
import '../temp/leaflet.label-src';
import {linear} from 'd3-scale';

export const Choropleth = L.GeoJSON.extend({

    options: {

    },

    initialize(options) {
        L.setOptions(this, options);
        this._layers = {};

        if (typeof options.features === 'string') {
            this.loadFeatures(options.features);
        } else {
            this.addFeatures(options.features);
        }

        if (typeof options.analytics === 'string') {
            this.loadAnalytics(options.analytics);
        } else {
            this.addAnalytics(options.analytics);
        }

        if (options.onLeftClick) {
            this.on('click', this.onClick, this);
        }
    },

    onClick(evt) {
        this.options.onLeftClick(evt.layer.feature, content => {
            evt.layer.label.close();
            L.popup()
                .setLatLng(evt.latlng)
                .setContent(content)
                .openOn(this._map);
        });
    },

    // Load DHIS 2 features
    loadFeatures(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addFeatures.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addFeatures(features) {
        this._geojson = features;

        if (Array.isArray(features)) {
            this._geojson = this._dhis2geojson(features);
        }

        this.addData(this._geojson);
        this.addAnalytics(this._analytics);
    },

    loadAnalytics(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addAnalytics.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addAnalytics(data) {
        this._analytics = data;

        if (data && this._geojson) {
            this._analytics = this._parseAnalytics(data);

            this.eachLayer(layer => {
                layer.bindLabel(layer.feature.properties.na + ' ' + this._analytics[layer.feature.id], {
                    direction: 'auto',
                });
            });

            this.setStyle(feature => ({
                color: '#333',
                weight: 1,
                fillColor: this._scale(this._analytics[feature.id]),
                fillOpacity: 0.8,
            }));
        }
    },

    _parseAnalytics(analytics) {
        const data = {};
        const values = [];
        let value;

        analytics.rows.forEach(d => {
            value = Number(d[2]);
            values.push(value);
            data[d[1]] = value;
        });

        values.sort((a, b) => a - b);

        this._scale = linear().domain([values[0], values[values.length - 1]]).range(['#FFEDA0', '#800026']);

        return data;
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
