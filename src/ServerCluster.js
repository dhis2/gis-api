import L from 'leaflet';

export const ServerCluster = L.GridLayer.extend({

    /*
    initialize(options) {
        L.TileLayer.prototype.initialize.call(this, options.url, options);
    },
    */

});

export default function serverCluster(options) {
    return new ServerCluster(options);
}
