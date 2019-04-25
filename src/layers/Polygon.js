import L from 'leaflet';
import { coordsToLatLngs } from '../utils/geometry';

// Polygon created from a GeoJSON feature
// Includes the required methods to support polygons in client clusters
// When clustered, the center of the polygon bounds is used
export const Polygon = L.Polygon.extend({
    options: {
        color: '#fff',
        weight: 0.5,
    },

    initialize(feature, opts) {
        const options = L.setOptions(this, opts)

        const { type, coordinates } = feature.geometry;
        const latlngs = coordsToLatLngs(coordinates, type === 'Polygon' ? 1 : 2);

        options.fillColor = feature.properties.color || options.fillColor
        options.fillOpacity = options.opacity

        L.Polygon.prototype.initialize.call(this, latlngs, options);

        this.feature = feature;
        this._latlng = this.getBounds().getCenter();
    },

    setOpacity(opacity) {
        this.setStyle({
            opacity,
            fillOpacity: opacity,
        });
    },

    // Needed for client clustering
    getLatLng() {
        return this._latlng;
    },

    // Dummy method needed for client clustering
    setLatLng() {},
});

export default function polygon(feature, options) {
    return new Polygon(feature, options);
}
