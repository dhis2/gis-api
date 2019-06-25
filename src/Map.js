import L from 'leaflet'
import 'leaflet.sync'
import layerTypes from './layerTypes'
import legend from './controls/Legend'
import fitBounds from './controls/FitBounds'
import search from './controls/Search'
import measure from './controls/Measure'
import {
    toLatLng,
    toLatLngBounds,
    toLngLatBounds,
    getBoundsFromLayers,
} from './utils/geometry'

export class Map extends L.Evented {
    options = {
        className: 'leaflet-dhis2',
        zoomControl: false,
        controls: [],
        worldCopyJump: true,
        maxZoom: 18,
        layerTypes,
        controlTypes: {
            legend,
            fitBounds,
            search,
            measure,
        },
    }

    constructor(el, opts) {
        super()

        const options = L.setOptions(this, opts)

        this._layers = []

        this._map = L.map(el, options)

        this._map.attributionControl.setPrefix('')

        L.DomUtil.addClass(this.getContainer(), options.className)

        L.Icon.Default.imagePath = '/images/'

        // Stop propagation to prevent dashboard dragging
        this._map.on('mousedown', evt => evt.originalEvent.stopPropagation())

        if (options.bounds) {
            this.fitBounds(options.bounds)
        }

        for (const control in options.controls) {
            if (options.controls.hasOwnProperty(control)) {
                this.addControl(control)
            }
        }

        this._map.on('click', evt => this.onClick(evt))
        this._map.on('contextmenu', evt => this.onContextMenu(evt))
    }

    getContainer() {
        return this._map.getContainer()
    }

    getLeafletMap() {
        return this._map
    }

    // Accept layer as config object
    addLayer(layer) {
        const { layerTypes } = this.options
        let newLayer = layer

        if (layer.type && layerTypes[layer.type]) {
            newLayer = this.createLayer(layer)
        }

        newLayer.createPane(this._map)

        this._map.addLayer(newLayer)
        this._layers.push(newLayer)

        return newLayer
    }

    removeLayer(layer) {
        this._layers = this._layers.filter(l => l !== layer)
        return this._map.removeLayer(layer)
    }

    hasLayer(layer) {
        return this._map.hasLayer(layer)
    }

    remove() {
        this._map.remove()
    }

    createLayer(layer) {
        return this.options.layerTypes[layer.type](layer)
    }

    addControl(control) {
        const { position, type } = control
        const { controlTypes } = this.options

        if (position) {
            control.position = position.replace(/-/, '')
        }

        let newControl = control

        if (type && controlTypes[type]) {
            newControl = controlTypes[type](control)
        } else if (type && L.control[type]) {
            newControl = L.control[type](control)
        }

        this._map.addControl(newControl)
        return newControl
    }

    fitBounds(bounds) {
        if (bounds) {
            this._map.fitBounds(toLatLngBounds(bounds))
        }
    }

    fitWorld() {
        this._map.fitWorld()
    }

    setView(lnglat, zoom) {
        this._map.setView(toLatLng(lnglat), zoom)
    }

    getLayers() {
        return this._layers
    }

    // Returns the combined bounds for all vector layers
    getLayersBounds() {
        return toLngLatBounds(getBoundsFromLayers(this.getLayers()))
    }

    // Returns true if the layer type is supported
    hasLayerSupport(type) {
        return !!this.options.layerTypes[type]
    }

    openPopup(content, lnglat, onClose) {
        this._map.openPopup(content, toLatLng(lnglat))

        if (typeof onClose === 'function') {
            this._map.once('popupclose', onClose)
        }
    }

    resize() {
        this._map.invalidateSize()
    }

    // Synchronize the view of two maps
    sync(map) {
        this.getLeafletMap().sync(map.getLeafletMap())
    }

    // Remove synchronize between two maps
    unsync(map) {
        this.getLeafletMap().sync(map.getLeafletMap())
    }

    onClick(evt) {
        this.fire('click', this._createClickEvent(evt))
    }

    onContextMenu(evt) {
        this.fire('contextmenu', this._createClickEvent(evt))
    }

    _createClickEvent(evt) {
        const { type, latlng, originalEvent } = evt
        const coordinates = [latlng.lng, latlng.lat]
        const position = [
            originalEvent.x,
            originalEvent.pageY || originalEvent.y,
        ]

        return { type, coordinates, position }
    }
}

export default Map
