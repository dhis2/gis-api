import L from 'leaflet';
import '../temp/Google'; // TODO: Fix when Google repo is compatible with Leaflet 1.0

export const Google = L.Google.extend({

    options: {
        style: 'ROADMAP',
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        L.Google.prototype.initialize.call(this, options.style, options);
    },

});

export default function google(options) {
    return new Google(options);
}
