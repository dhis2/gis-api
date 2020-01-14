// Custom cluster marker used for server clusters
import L from 'leaflet'
import clusterIcon from './ClusterIcon'
import circleMarker from './CircleMarker'

export const ClusterMarker = L.Marker.extend({
    initialize(feature, options) {
        this._feature = feature
        this._latlng = L.GeoJSON.coordsToLatLng(feature.geometry.coordinates)

        options.icon = clusterIcon({
            size: feature.properties.size,
            count: feature.properties.point_count,
            color: options.fillColor,
        })

        L.setOptions(this, options)
    },

    getFeature() {
        return this._feature
    },

    getBounds() {
        return this._feature.properties.bounds
    },

    spiderify() {
        if (!this._spiderified) {
            const feature = this._feature
            const options = this.options
            const map = this._map
            const latlng = this.getLatLng()
            const center = map.latLngToLayerPoint(latlng)
            const ids = (this._feature.properties.id || '').split(',')
            const count = feature.properties.point_count
            const legOptions = { weight: 1.5, color: '#222', opacity: 0.5 }
            const _2PI = Math.PI * 2
            const circumference = 13 * (2 + count)
            const startAngle = Math.PI / 6
            const legLength = circumference / _2PI
            const angleStep = _2PI / count

            this._spiderLegs = L.featureGroup()
            this._spiderMarkers = L.featureGroup()

            this._spiderMarkers.on('click', this.onSpiderMarkerClick, this)

            for (let i = count - 1, angle, point, id, newPos; i >= 0; i--) {
                angle = startAngle + i * angleStep
                point = L.point(
                    center.x + legLength * Math.cos(angle),
                    center.y + legLength * Math.sin(angle)
                )._round() // eslint-disable-line
                id = ids[i]
                newPos = map.layerPointToLatLng(point)

                this._spiderLegs.addLayer(
                    L.polyline([latlng, newPos], legOptions)
                )

                this._spiderMarkers.addLayer(
                    circleMarker(
                        {
                            type: 'Feature',
                            geometry: {
                                type: 'Point',
                                coordinates: [newPos.lng, newPos.lat],
                            },
                            properties: {
                                id
                            }
                        },
                        this.options
                    )
                )
            }

            this._spiderLegs.addTo(map)
            this._spiderMarkers.addTo(map)

            this._originalOpacity = options.opacity
            this.setOpacity(0.1)
            this._spiderified = true
        }

        return this
    },

    unspiderify() {
        const map = this._map

        this.setOpacity(this._originalOpacity)

        if (this._spiderLegs && map.hasLayer(this._spiderLegs)) {
            map.removeLayer(this._spiderLegs)
        }

        if (this._spiderMarkers && map.hasLayer(this._spiderMarkers)) {
            map.removeLayer(this._spiderMarkers)
            this._spiderMarkers.off('click', this.onSpiderMarkerClick, this)
        }

        this._spiderified = false

        return this
    },

    onSpiderMarkerClick(evt) {
        if (this.options.onClick) {
            const { type, latlng, layer } = evt
            const coordinates = [latlng.lng, latlng.lat]
            
            // Show coordinates from the original feature, not the spider
            const feature = {
                ...layer.feature,
                geometry: {
                    ...this._feature.geometry
                },
            }

            this.options.onClick({ type, coordinates, feature })
        }
    },

    onRemove(map) {
        if (this._spiderified) {
            this.unspiderify()
        }
        L.Marker.prototype.onRemove.call(this, map)
    },
})

export default function clusterMarker(feature, options) {
    return new ClusterMarker(feature, options)
}
