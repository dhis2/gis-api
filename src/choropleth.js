import L from 'leaflet';

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
    },

    loadFeatures(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addFeatures.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addFeatures(features) {
        let geojson = features;

        if (Array.isArray(features)) {
            geojson = this._dhis2geojson(features);
        }

        this.addData(geojson);
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
