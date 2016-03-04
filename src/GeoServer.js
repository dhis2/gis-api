import L from 'leaflet';

export const GeoServer = L.TileLayer.WMS.extend({

    defaultWmsParams: {
        service: 'WMS',
        request: 'GetMap',
        version: '1.1.1',
        layers: '',
        styles: '',
        format: 'image/png',
        transparent: true,
    },

    initialize(options) {
        L.TileLayer.WMS.prototype.initialize.call(this, options.url, options);
    },

});

export default function geoServer(options) {
    return new GeoServer(options);
}
