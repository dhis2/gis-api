import L from 'leaflet';

export const MapQuest = L.TileLayer.extend({

    options: {
        url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
        subdomains: '1234',
        attribution: '&copy; <a href="http://www.mapquest.com/">MapQuest</a>, &copy; <a href="http://www.openstreetmap.org/about">OpenStreetMap</a>',
        maxZoom: 18,
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        L.TileLayer.prototype.initialize.call(this, options.url, options);
    },

});

export default function mapQuest(options) {
    return new MapQuest(options);
}
