import L from 'leaflet'

const noAnimate = { animate: false }

L.Map.include({
    _syncedMaps: {},
    _onDragEndSync: {},

    sync: function(id) {
        const { setView } = L.Map.prototype
        const origin = this

        if (!this._syncedMaps[id]) {
            this._syncedMaps[id] = []
        }
        const syncedMaps = this._syncedMaps[id]

        if (!syncedMaps.includes(this)) {
            syncedMaps.push(this)

            L.extend(this, {
                setView: (center, zoom, options) =>
                    syncedMaps.forEach(map => {
                        setView.call(map, center, zoom, options)
                    }),
            })

            // Override method to drag all synced maps at the same time
            this.dragging._draggable._updatePosition = function() {
                const { getPosition, setPosition } = L.DomUtil
                const oldPos = getPosition(this._element)

                L.Draggable.prototype._updatePosition.call(this)

                const newPos = getPosition(this._element)
                const changePos = oldPos.subtract(newPos)

                syncedMaps.forEach(map => {
                    if (map !== origin) {
                        const mapPos = getPosition(
                            map.dragging._draggable._element
                        )
                        setPosition(
                            map.dragging._draggable._element,
                            mapPos.subtract(changePos)
                        )
                    }
                })
            }

            this._onDragEndSync[id] = evt => {
                const { target } = evt
                const center = target.getCenter()
                const zoom = target.getZoom()

                syncedMaps.forEach(map => {
                    if (map !== target) {
                        setView.call(map, center, zoom, noAnimate)
                    }
                })
            }

            this.on('dragend', this._onDragEndSync[id])
        }
    },

    unsync: function(id) {
        const syncedMaps = this._syncedMaps[id]

        if (syncedMaps) {
            const idx = syncedMaps.indexOf(this)
            if (idx !== -1) {
                syncedMaps.splice(idx, 1)
            }

            // Reset methods
            L.extend(this, {
                setView: L.Map.prototype.setView,
            })

            this.dragging._draggable._updatePosition =
                L.Draggable.prototype._updatePosition

            this.off('dragend', this._onDragEndSync[id])

            delete this._onDragEndSync[id]
        }
    },
})
