// Facility layer circular area

import L from 'leaflet';
import { GeoJson } from './GeoJson';

export const Circles = GeoJson.extend({

    options: {
        radius: 1000,
        style: {
            color: '#95c8fb',
            weight: 1,
        },
    },

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        GeoJson.prototype.initialize.call(this, options);
    },

    pointToLayer(feature, latlng) {
        return L.circle(latlng, this.options.radius);
    },

});

export default function circles(options) {
    return new Circles(options);
}
