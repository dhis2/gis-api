import L from 'leaflet';
import { GeoJson } from './GeoJson';

// Circular buffer areas
export const Circles = GeoJson.extend({

    options: {
        radius: 1000,
        style: {
            color: '#95c8fb',
            weight: 1,
        },
        opacityFactor: 0.2,
        highlightStyle: false,
    },

    pointToLayer(feature, latlng) {
        return L.circle(latlng, {
            radius: this.options.radius,
            pane: this.options.pane,
        });
    },

    setOpacity(opacity) {
        this.setStyle({
            opacity,
            fillOpacity: opacity * this.options.opacityFactor,
        });
    },

});

export default function circles(options) {
    return new Circles(options);
}
