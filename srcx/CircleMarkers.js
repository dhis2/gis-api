// Proportional symbols
// Currently not i use

import {GeoJson} from './GeoJson';
import {linear} from 'd3-scale';

export const CircleMarkers = GeoJson.extend({

    options: {
        style: {
            color: '#333',
            weight: 1,
            fillOpacity: 0.8,
        },
        highlight: true,
        colorRange: ['#FFEDA0', '#800026'],
        radiusRange: [3, 30],
        labelTemplate: '{na}',
    },

    initialize(options = {}) {
        options.pointToLayer = this.pointToLayer.bind(this);
        Features.prototype.initialize.call(this, options);
    },

    addFeatures(geojson) {
        const colorScale = linear().domain([this._min, this._max]).range(this.options.colorRange);
        const radiusScale = linear().domain([this._min, this._max]).range(this.options.radiusRange);

        this.addData(geojson);
        this.addLabels(this.options.labelTemplate);

        this.setStyle(feature => ({
            fillColor: colorScale(feature.properties.value),
            radius: radiusScale(feature.properties.value),
        }));
    },

    pointToLayer(geojson, latlng) {
        return new L.CircleMarker(latlng, this.options.style);
    },

});

export default function circleMarkers(options) {
    return new CircleMarkers(options);
}
