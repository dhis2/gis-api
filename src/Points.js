import {GeoJson} from './GeoJson';

// Layer of circle markers
export const Points = GeoJson.extend({

    options: {
        style: {
            radius: 6,
            color: '#fff',
            weight: 1,
            fillColor: '#000',
            fillOpacity: 0.7,
        },
    },

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        GeoJson.prototype.initialize.call(this, options);
    },

    pointToLayer(feature, latlng) {
        return L.circleMarker(latlng);
    },

});

export default function points(options) {
    return new Points(options);
}
