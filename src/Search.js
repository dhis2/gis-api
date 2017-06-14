import L from 'leaflet';
import 'leaflet-geocoder-mapzen';

// Wrapper for Mapzen Search geocoder: https://github.com/mapzen/leaflet-geocoder
export const Search = L.Control.Geocoder.extend({

    options: {
        position: 'topright',
        attribution: null,
        panToPoint: null,
    },

    initialize (options) {
        L.Util.setOptions(this, options);
        L.Control.Geocoder.prototype.initialize.call(this, options.apiKey, options);
    },

});

export default function search(options) {
    return new Search(options);
}
