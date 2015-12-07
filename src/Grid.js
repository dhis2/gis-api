import {Choropleth} from './Choropleth';
import turf from 'turf'; // TODO: Only include what we use

// https://www.mapbox.com/blog/heatmaps-and-grids-with-turf/
export const Grid = Choropleth.extend({

    options: {
        units: 'kilometers',
        labelTemplate: '{value}',
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);

        this._layers = {};
        this._features = turf.hexGrid(options.bbox, options.cellWidth, options.units);

        this.setData(options.data);
    },

    onLoad(features, data) {
        const counted = turf.count(features, this._dhis2geojson(data), 'value');
        this.addFeatures(this._parseFeatureCollection(counted));
    },

    _parseFeatureCollection(featureCollection) {
        this._min = 1;
        this._max = 1;

        featureCollection.features = featureCollection.features.filter(d => {
            if (d.properties.value > this._max) {
                this._max = d.properties.value;
            }
            return d.properties.value; // Only include features with values
        });

        return featureCollection.features;
    },

    _dhis2geojson(data) {
        return {
            type: 'FeatureCollection',
            features: data.map(d => ({
                type: 'Feature',
                id: d.id,
                properties: d,
                geometry: {
                    type: 'Point',
                    coordinates: d.co,
                },
            })),
        };
    },

});

export default function grid(options) {
    return new Grid(options);
}
