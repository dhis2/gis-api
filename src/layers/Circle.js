import L from 'leaflet'
import { toLngLat } from '../utils/geometry'

// Creates a circle marker from a GeoJSON feature
// Used for GeoJSON, client and server cluster
export const Circle = L.Circle.extend({
    options: {
        weight: 0.5,
        radius: 6,
    },

    initialize(latlng, options) {
        options.fillOpacity = options.opacity

        this._lnglat = toLngLat(latlng)

        L.Circle.prototype.initialize.call(this, latlng, options)
    },

    getBounds() {
        if (!this._map) {
            return this._lnglat
        }
        L.Circle.prototype.getBounds.call(this)
    },

    setOpacity(opacity) {
        this.setStyle({
            opacity,
            fillOpacity: opacity,
        })
    },
})

export default function circle(feature, options) {
    return new Circle(feature, options)
}
