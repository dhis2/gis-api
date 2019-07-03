import L from 'leaflet'

const noAnimate = { animate: false }

L.Map.include({
    _syncedMaps: {},
    _onDragEndSync: {},

    sync: function(id) {
        const { setView } = L.Map.prototype
        const origin = this
        let syncedMaps = this._syncedMaps[id]

        if (!syncedMaps) {
            syncedMaps = []
            this._syncedMaps[id] = syncedMaps
        }

        if (!syncedMaps.includes(this)) {
            syncedMaps.push(this)

            L.extend(this, {
                setView: (center, zoom, options) =>
                    syncedMaps.forEach(map => {
                        setView.call(map, center, zoom, options)
                    }),
                _onResize: evt => console.log,
            })

            // Override method to drag all synced maps at the same time
            this.dragging._draggable._updatePosition = function() {
                const { getPosition, setPosition } = L.DomUtil
                const oldPos = getPosition(this._element)

                L.Draggable.prototype._updatePosition.call(this)

                const newPos = getPosition(this._element)
                const changePos = oldPos.subtract(newPos)

                syncedMaps
                    .filter(map => map !== origin)
                    .forEach(map => {
                        const mapPos = getPosition(
                            map.dragging._draggable._element
                        )
                        setPosition(
                            map.dragging._draggable._element,
                            mapPos.subtract(changePos)
                        )
                    })
            }

            this._onDragEndSync[id] = evt => {
                const origin = evt.target
                const center = origin.getCenter()
                const zoom = origin.getZoom()

                syncedMaps
                    .filter(map => map !== origin)
                    .forEach(map => setView.call(map, center, zoom, noAnimate))
            }

            this.on('dragend', this._onDragEndSync[id])
        }
    },

    unsync: function(id) {
        const syncedMaps = this._syncedMaps[id]

        if (syncedMaps) {
            for (let i = 0; i < syncedMaps.length; i++) {
                if (syncedMaps[i] === this) {
                    syncedMaps.splice(i, 1)
                    i--
                }
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
