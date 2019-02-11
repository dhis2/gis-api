import L from 'leaflet';
import layerMixin from './layerMixin';

export const WmsLayer = L.TileLayer.WMS.extend({
    

    initialize(opts) {
        const options = L.extend({ // Defaults
            errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // eslint-disable-line
            format: 'image/png',
            transparent: true,
        }, opts);

        L.TileLayer.WMS.prototype.initialize.call(this, options.url, options);
    },

    ...layerMixin,
});

export default function wmsLayer(options) {
    return new WmsLayer(options);
}
