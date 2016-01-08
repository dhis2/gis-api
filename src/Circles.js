import {GeoJSON} from './GeoJson';

export const Circles = GeoJSON.extend({

    options: {
        radius: 1000,
        style: {
            color: 'orange',
            weight: 1,
        },
    },

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        GeoJSON.prototype.initialize.call(this, options.data, options);
    },

    pointToLayer(feature, latlng) {
        return L.circle(latlng, this.options.radius);
    },

});

export default function circles(options) {
    return new Circles(options);
}
