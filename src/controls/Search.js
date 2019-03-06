import L from 'leaflet';
import 'leaflet-control-geocoder';

// Wrapper for leaflet-control-geocoder: https://github.com/perliedman/leaflet-control-geocoder
export const Search = L.Control.Geocoder.extend({});

export default function search(options) {
    return new Search(options);
}
