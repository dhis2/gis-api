import L from 'leaflet'
import turfBuffer from '@turf/buffer'
import { GeoJson } from './GeoJson'
import { Circle } from './Circle'

export const Buffer = GeoJson.extend({
    options: {
        buffer: 1000,
        style: {
            color: '#95c8fb',
            weight: 1,
            pointerEvents: 'none',
        },
        opacityFactor: 0.2,
        highlightStyle: false,
        pane: 'buffers',
    },

    initialize(options = {}) {
        // Replace polygons with buffered geometries
        options.data = options.data.map(feature =>
            feature.geometry.type !== 'Point'
                ? {
                      ...feature,
                      geometry: turfBuffer(feature, options.buffer / 1000)
                          .geometry, // km
                  }
                : feature
        )

        GeoJson.prototype.initialize.call(this, options)
    },

    // Set color from feature
    addLayer(layer) {
        const { feature } = layer
        const { color } = feature.properties

        if (color && layer.setStyle) {
            layer.setStyle({ color })
        }

        GeoJson.prototype.addLayer.call(this, layer)
    },

    pointToLayer(geojson, latlng) {
        // Draw points as circles using buffer as radius
        return new Circle(latlng, {
            ...this.options.style,
            pane: this.options.pane,
            radius: this.options.buffer,
        })
    },

    setOpacity(opacity) {
        this.setStyle({
            opacity,
            fillOpacity: opacity * this.options.opacityFactor,
        })
    },
})

export default function buffer(options) {
    return new Buffer(options)
}
