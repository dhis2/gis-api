import L from 'leaflet';
import '../temp/leaflet.label-src';

export const Districts = L.GeoJSON.extend({

    options: {
        style: {
            color: '#555',
            weight: 2,
            fillOpacity: 0,
        },
        labelTemplate: '{na}',
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        this._layers = {};
        this.setFeatures(options.features);
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
            this.addLabels(this.options.labelTemplate);
        }
    },

    addPopup(latlng, content) {
        L.popup()
            .setLatLng(latlng)
            .setContent(content)
            .openOn(this._map);
    },

    addLabels(labelTemplate) {
        this.eachLayer(layer => {
            layer.bindLabel(L.Util.template(labelTemplate, layer.feature.properties));
        });
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

export default function districts(options) {
    return new Districts(options);
}
