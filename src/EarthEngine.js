import L from 'leaflet';
import '../temp/Google'; // TODO: Fix when Google repo is compatible with Leaflet 1.0
import '../temp/ee_api_js_debug'; // TODO: Install with NPM from GitHub: https://github.com/google/earthengine-api

export const EarthEngine = L.TileLayer.extend({

    options: {
        url: 'https://earthengine.googleapis.com/map/{mapId}/{z}/{x}/{y}?token={token}',
        // view-source:http://server-auth-dot-ee-demos.appspot.com/
        token: '219946e0faa093860209f17a5cc1222f',
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        L.TileLayer.prototype.initialize.call(this, options.url, options);
    },

});

export default function earthEngine(options) {
    return new EarthEngine(options);
}
