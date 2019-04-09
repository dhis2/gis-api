import L from 'leaflet'
import layerMixin from './layerMixin'
import circleMarker from './CircleMarker'

// Base class for most vector layers
export const GeoJson = L.GeoJSON.extend({
    ...layerMixin,

    options: {
        style: {
            weight: 1,
        },
        highlightStyle: {
            weight: 3,
        },
        resetStyle: {
            weight: 1,
        },
    },

    initialize(options) {
        L.GeoJSON.prototype.initialize.call(this, options.data, {
            pane: options.id,
            pointToLayer: this.pointToLayer.bind(this),
            ...options,
        })
    },

    addLayer(layer) {
        const { label, hoverLabel, popup } = this.options
        const { properties } = layer.feature

        if (hoverLabel || label) {
            const tooltip = L.Util.template(hoverLabel || label, properties)
            layer.bindTooltip(tooltip, {
                sticky: true,
            })
        }

        L.GeoJSON.prototype.addLayer.call(this, layer)
    },

    // Use circle markers for point features
    pointToLayer(feature) {
        return circleMarker(feature, this.options)
    },

    setOpacity(opacity) {
        this.setStyle({
            opacity,
            fillOpacity: opacity,
        })
    },

    findById(id) {
        for (const i in this._layers) {
            // eslint-disable-line
            if (this._layers[i].feature.id === id) {
                return this._layers[i]
            }
        }

        return null
    },

    onAdd(map) {
        const {
            opacity,
            isVisible,
            onClick,
            onRightClick,
            highlightStyle,
        } = this.options

        L.GeoJSON.prototype.onAdd.call(this, map)

        this.setOpacity(opacity)
        this.setVisibility(isVisible)

        if (onClick) {
            this.on('click', this.onClick, this)
        }

        if (onRightClick) {
            this.on('contextmenu', this.onRightClick, this)
        }

        if (highlightStyle) {
            this.on('mouseover', this.onMouseOver, this)
            this.on('mouseout', this.onMouseOut, this)
        }

        this.fire('ready')
    },

    onRemove(map) {
        const { onClick, onRightClick, highlightStyle } = this.options

        L.GeoJSON.prototype.onRemove.call(this, map)

        if (onClick) {
            this.off('click', this.onClick, this)
        }

        if (onRightClick) {
            this.off('contextmenu', this.onRightClick, this)
        }

        if (highlightStyle) {
            this.off('mouseover', this.onMouseOver, this)
            this.off('mouseout', this.onMouseOut, this)
        }
    },

    // Set highlight style
    onMouseOver(evt) {
        evt.layer.setStyle(this.options.highlightStyle)
    },

    // Reset style
    onMouseOut(evt) {
        if (!evt.layer.feature.isSelected) {
            evt.layer.setStyle(this.options.resetStyle)
        }
    },

    // 'Normalise' event before passing back to app
    onClick(evt) {
        L.DomEvent.stopPropagation(evt)

        const { type, layer, latlng } = evt
        const coordinates = [latlng.lng, latlng.lat]
        const feature = layer.feature

        this.options.onClick({ type, coordinates, feature })
    },

    // 'Normalise' event before passing back to app
    onRightClick(evt) {
        L.DomEvent.stopPropagation(evt)

        const { type, layer, latlng, originalEvent } = evt
        const coordinates = [latlng.lng, latlng.lat]
        const position = [
            originalEvent.x,
            originalEvent.pageY || originalEvent.y,
        ]
        const feature = layer.feature

        this.options.onRightClick({ type, coordinates, position, feature })
    },
})

export default function geoJson(options) {
    return new GeoJson(options)
}
