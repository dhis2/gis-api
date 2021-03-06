import L from 'leaflet'
import clusterIcon from './ClusterIcon'
import circleMarker from './CircleMarker'
import polygon from './Polygon'
import { scaleLog } from 'd3-scale'
import 'leaflet.markercluster' // Extends L above
import layerMixin from './layerMixin'
import { toLngLatBounds } from '../utils/geometry'

export const ClientCluster = L.MarkerClusterGroup.extend({
    ...layerMixin,

    options: {
        maxClusterRadius: 40,
        showCoverageOnHover: false,
        iconCreateFunction(cluster) {
            const count = cluster.getChildCount()

            cluster.options.opacity = this.opacity

            return clusterIcon({
                color: this.fillColor,
                opacity: this.opacity,
                size: this.scale(count),
                count,
            })
        },
        domain: [1, 1000],
        range: [16, 40],
        radius: 6, // circle marker radius
    },

    initialize(opts) {
        const options = L.setOptions(this, {
            ...opts,
            pane: opts.id,
        })

        L.MarkerClusterGroup.prototype.initialize.call(this, options)

        if (options.data) {
            this.addData(options.data)
        }

        this.on('click', this.onMarkerClick, this)
    },

    onMarkerClick(evt) {
        L.DomEvent.stopPropagation(evt)

        const { type, layer, latlng } = evt
        const coordinates = [latlng.lng, latlng.lat]
        const { feature } = layer

        this.options.onClick({ type, coordinates, feature })
    },

    addData(data) {
        const options = this.options

        if (data.length) {
            options.domain = [1, data.length]
            options.scale = scaleLog()
                .domain(options.domain)
                .range(options.range)
                .clamp(true)
            this.addLayers(
                data.map(f =>
                    f.geometry.type === 'Point'
                        ? circleMarker(f, options)
                        : polygon(f, options)
                )
            )
        }
    },

    setOpacity(opacity) {
        this.options.opacity = opacity
        this.eachLayer(layer => layer.setOpacity(opacity)) // Circle markers
        this._featureGroup.eachLayer(layer => layer.setOpacity(opacity)) // Cluster markers
    },

    // Convert bounds before returning
    getBounds() {
        const bounds = L.MarkerClusterGroup.prototype.getBounds.call(this)

        if (bounds.isValid()) {
            return toLngLatBounds(bounds)
        }
    },
})

export default function clientCluster(options) {
    return new ClientCluster(options)
}
