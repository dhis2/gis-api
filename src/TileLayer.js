import L from 'leaflet';

export const TileLayer = L.TileLayer.extend({

    initialize(options) {
        L.TileLayer.prototype.initialize.call(this, options.url, options);
    },

});

export default function tileLayer(options) {
    return new TileLayer(options);
}
