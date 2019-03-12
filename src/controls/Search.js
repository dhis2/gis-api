import L from 'leaflet';
import 'leaflet-control-geocoder';

// Wrapper for leaflet-control-geocoder: https://github.com/perliedman/leaflet-control-geocoder
// Displays a popup for the search result (no marker)

export default function search(options) {
    return new L.Control.Geocoder({
        defaultMarkGeocode: false,
        ...options,
    }).on('markgeocode', (evt) => {
        const map = evt.target._map;

        if (map) {
            const { bbox, center, html, name } = evt.geocode;

            map.fitBounds(bbox);

            L.popup()
                .setLatLng(center)
                .setContent(html || name)
                .openOn(map);
        }
    });
}
