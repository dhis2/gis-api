import L from 'leaflet';
import layerMixin from './layerMixin';

export const WmsLayer = L.TileLayer.WMS.extend({
    ...layerMixin,

    initialize(opts) {
        const options = L.extend({ // Defaults
            errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // eslint-disable-line
            format: 'image/png',
            transparent: true,
        }, opts);

        L.TileLayer.WMS.prototype.initialize.call(this, options.url, {
            ...options,
            pane: options.id,
        });
    },

    onAdd(map) {
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        this.setVisibility(this.options.isVisible);
        this.setIndex(this.options.index);
    },
});

export default function wmsLayer(options) {
    return new WmsLayer(options);
}
