import L from 'leaflet'

// Change zoom control to allow dom container to be accessible in map
// https://github.com/Leaflet/Leaflet/blob/master/src/control/Control.Zoom.js
L.Control.Zoom.include({
    onAdd(map) {
        const zoomName = 'leaflet-control-zoom'
        const container = L.DomUtil.create('div', zoomName + ' leaflet-bar')
        const { options } = this

        this._zoomInButton = this._createButton(
            options.zoomInText,
            options.zoomInTitle,
            zoomName + '-in',
            container,
            this._zoomIn
        )
        this._zoomOutButton = this._createButton(
            options.zoomOutText,
            options.zoomOutTitle,
            zoomName + '-out',
            container,
            this._zoomOut
        )

        this._updateDisabled()
        map.on('zoomend zoomlevelschange', this._updateDisabled, this)

        // Added lines to make container accessible in map
        this._container = container
        map.zoomControl = this

        return container
    },
})
