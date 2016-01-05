import L from 'leaflet';
import '../temp/leaflet.label-src';

export const GeoJSON = L.GeoJSON.extend({

    setOpacity(opacity) {
        this.setStyle({
            opacity: opacity,
            fillOpacity: opacity,
        });
    },

});

export default function points(options) {
    return new Points(options);
}
