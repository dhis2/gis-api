import L from 'leaflet';
import layerMixin from './layerMixin';

export const TileLayer = L.TileLayer.extend({
    ...layerMixin,

    options: {
        errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // eslint-disable-line
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);

        L.TileLayer.prototype.initialize.call(this, options.url, options);

        this.on('load', this.onLoad, this);
    },

    // Fire ready event when all tiles are loaded
    onLoad() {
        this.fire('ready');
        this.off('load', this.onLoad, this);
    },
});

export default function tileLayer(options) {
    return new TileLayer(options);
}
