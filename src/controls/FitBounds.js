import L from 'leaflet'
import { getBoundsFromLayers } from '../utils/geometry'

// Adds a fit map to contents button
export const FitBounds = L.Control.extend({
    options: {
        position: 'topleft',
    },

    onAdd(map) {
        this._map = map
        this._initLayout()
        this._toggleControl(this._hasLayersBounds())

        map.on('layeradd', this._onLayerChange, this)
        map.on('layerremove', this._onLayerChange, this)

        return this._container
    },

    onRemove(map) {
        map.off('layeradd', this._onLayerChange, this)
        map.off('layerremove', this._onLayerChange, this)
    },

    _initLayout() {
        this._container = L.DomUtil.create('div', 'leaflet-control-fit-bounds')

        L.DomEvent.disableClickPropagation(this._container)
        if (!L.Browser.touch) {
            L.DomEvent.disableScrollPropagation(this._container)
        }

        this._container.title = 'Zoom to content'

        L.DomEvent.on(this._container, 'click', this._onClick, this)
    },

    // Returns true if map has vector layers
    _hasLayersBounds() {
        let hasBounds = false

        this._map.eachLayer(layer => {
            if (this._isMainLayer(layer) && layer.getBounds) {
                hasBounds = true
            }
        })

        return hasBounds
    },

    // Returns combined bounds for non-tile layers
    _getLayersBounds() {
        const layers = []
        this._map.eachLayer(layer => {
            if (this._isMainLayer(layer)) {
                layers.push(layer)
            }
        })
        return getBoundsFromLayers(layers)
    },

    _onClick() {
        const bounds = this._getLayersBounds()

        if (bounds) {
            this._map.fitBounds(bounds)
        }
    },

    _onLayerChange(evt) {
        if (this._isMainLayer(evt.layer)) {
            this._toggleControl(this._hasLayersBounds())
        }
    },

    _isMainLayer(layer) {
        return Boolean(layer.options.index && !layer.feature)
    },

    // Only show control when map contains 'fittable' content
    _toggleControl(hasBounds) {
        this._container.style.display = hasBounds ? 'block' : 'none'
    },
})

export default function fitBounds(options) {
    return new FitBounds(options)
}
