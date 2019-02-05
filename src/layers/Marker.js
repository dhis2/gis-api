// import L from 'leaflet';

// This class is no longer in use
export const Marker = L.Marker.extend({

    options: {
        labelOffset: [0, 10],
    },

    _initIcon() {
        if (this.options.label) {
            const classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');
            const label = this._label = document.createElement('div'); // eslint-disable-line

            label.innerHTML = this.options.label;

            L.DomUtil.addClass(label, 'leaflet-marker-label');
            L.DomUtil.addClass(label, classToAdd);

            if (this.options.labelStyle) {
                L.extend(label.style, this.options.labelStyle);
            }

            this.getPane().appendChild(label);
        }

        L.Marker.prototype._initIcon.call(this);
    },

    _removeIcon() {
        if (this._label) {
            L.DomUtil.remove(this._label);
            this._label = null;
        }

        L.Marker.prototype._removeIcon.call(this);
    },

    _setPos(pos) {
        if (this._label) {
            L.DomUtil.setPosition(this._label, pos.add(this.options.labelOffset));
        }

        L.Marker.prototype._setPos.call(this, pos);
    },

    _updateZIndex(offset) {
        if (this._label) {
            this._label.style.zIndex = this._zIndex + offset;
        }

        L.Marker.prototype._updateZIndex.call(this, offset);
    },

});

export default function marker(latlng, options) {
    return new Marker(latlng, options);
}
