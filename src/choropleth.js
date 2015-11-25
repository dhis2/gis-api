import {Features} from './Features';
import {linear} from 'd3-scale';

export const Choropleth = Features.extend({

    options: {
        style: {
            color: '#333',
            weight: 1,
            fillOpacity: 0.8,
        },
        highlight: true,
        colorRange: ['#FFEDA0', '#800026'],
        labelTemplate: '{na} {value}',
    },

    addFeatures(geojson) {
        const scale = linear().domain([this._min, this._max]).range(this.options.colorRange);

        this.addData(geojson);
        this.addLabels(this.options.labelTemplate);

        this.setStyle(feature => ({
            fillColor: scale(feature.properties.value),
        }));
    },

});

export default function choropleth(options) {
    return new Choropleth(options);
}
