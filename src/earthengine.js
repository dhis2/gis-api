import L from 'leaflet';

export const EarthEngine = L.TileLayer.extend({

    options: {
        url: 'https://earthengine.googleapis.com/map/{mapId}/{z}/{x}/{y}?token={token}',
        // view-source:http://server-auth-dot-ee-demos.appspot.com/
        token: '6c2f0b280c3bd1244dbeda7811915b68',
        opacity: 0.5,
    },

    initialize(mapId, options = {}) {
        options.mapId = mapId;
        this._url = this.options.url;
        L.TileLayer.prototype.initialize.call(this, this._url, options);
        this._url = this.options.url;
    },

});

export default function earthEngine(mapId, options) {
    return new EarthEngine(mapId, options);
}
