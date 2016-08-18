import L from 'leaflet';

export const WmsLayer = L.TileLayer.WMS.extend({

    options: {
        errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        format: 'image/png',
        transparent: true,
    },

    initialize(options) {
        L.TileLayer.WMS.prototype.initialize.call(this, options.url, options);
    },

});

export default function wmsLayer(options) {
    return new WmsLayer(options);
}
