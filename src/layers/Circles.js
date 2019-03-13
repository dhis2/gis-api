import L from 'leaflet';
import { GeoJson } from './GeoJson';

// Circular buffer areas
export const Circles = GeoJson.extend({
    options: {
        radius: 1000,
        style: {
            color: '#95c8fb',
            weight: 1,
            pointerEvents: 'none',
        },
        opacityFactor: 0.2,
        highlightStyle: false,
    },

    pointToLayer(feature, latlng) {
        const { pane, radius } = this.options;

        return L.circle(latlng, {
            radius,
            pane,
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
