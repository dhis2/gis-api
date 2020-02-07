import L from 'leaflet'
import './utils/L.Map.Sync'
import layerTypes from './layers/layerTypes'
import controlTypes from './controls/controlTypes'
import translateOptions from './utils/options'
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
    }

    constructor(el, opts) {
        super()

        const options = L.setOptions(this, translateOptions(opts))

        this._layers = []
        this._controls = {}

        const map = L.map(el, options)
        this._map = map

        map.on('load', this.onLoad)
        map.on('click', this.onClick)
        map.on('contextmenu', this.onContextMenu)
        map.on('resize', this.onResize)

        // Stop propagation to prevent dashboard dragging
        map.on('mousedown', evt => evt.originalEvent.stopPropagation())

        if (map.attributionControl) {
            map.attributionControl.setPrefix('')
        }

        L.DomUtil.addClass(this.getContainer(), options.className)

        L.Icon.Default.imagePath = '/images/'

        if (options.bounds) {
            this.fitBounds(options.bounds)
        }

        for (const control in options.controls) {
            if (options.controls.hasOwnProperty(control)) {
                this.addControl(control)
            }
        }
    }

    getContainer() {
        return this._map.getContainer()
    }

    getLeafletMap() {
        return this._map
    }

    // Accept layer as config object
    addLayer(layer) {
        let newLayer = layer

        if (layer.type) {
            newLayer = this.createLayer(layer)
        }

        if (newLayer instanceof L.Layer) {
            newLayer.createPane(this._map)

            this._map.addLayer(newLayer)
            this._layers.push(newLayer)

            return newLayer
        }

        return null
    }

    removeLayer(layer) {
        this._layers = this._layers.filter(l => l !== layer)
        return this._map.removeLayer(layer)
    }

    hasLayer(layer) {
        return this._map.hasLayer(layer)
    }

    remove() {
        this._map.off('load', this.onLoad)
        this._map.off('click', this.onClick)
        this._map.off('contextmenu', this.onContextMenu)
        this._map.off('resize', this.onResize)
        this._map.remove()
    }

    createLayer(layer) {
        const layerFactory = layerTypes[layer.type]

        if (layerFactory) {
            return layerFactory(layer)
        }

        return null
    }

    addControl(control) {
        const { position, type } = control

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

        if (type) {
            this._controls[type] = newControl
        }

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

    // Returns the dom element of the control
    getControlContainer(type) {
        if (this._controls[type]) {
            return this._controls[type]._container
        }
    }

    // Returns the map zoom level
    getZoom() {
        return this._map.getZoom()
    }

    // Returns true if the layer type is supported
    static hasLayerSupport(type) {
        return !!layerTypes[type]
    }

    // Open a popup at lnglat
    openPopup(content, lnglat, onClose) {
        this._map.openPopup(content, toLatLng(lnglat))

        if (typeof onClose === 'function') {
            this._map.once('popupclose', onClose)
        }
    }

    // Closes the popup previously opened with openPopup
    closePopup() {
        this._map.closePopup()
    }

    resize() {
        this._map.invalidateSize()
    }

    // Synchronize this map with other maps with the same id
    sync(id) {
        this._map.sync(id)
    }

    // Remove synchronize of this map
    unsync(id) {
        this._map.unsync(id)
    }

    onClick = evt => {
        this.fire('click', this._createClickEvent(evt))
    }

    onContextMenu = evt => {
        this.fire('contextmenu', this._createClickEvent(evt))
    }

    onResize = evt => {
        this.fire('resize', evt)
    }

    onLoad = () => {
        this.fire('ready', this)
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
