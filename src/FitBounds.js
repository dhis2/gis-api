import L from 'leaflet';

// Marker with label support
export const FitBounds = L.Control.extend({

    options: {
        position: 'topleft',
    },

    onAdd(map) {
        this._map = map;
        this._initLayout();
        return this._container;
    },

    _initLayout() {
        const container = this._container = L.DomUtil.create('div', 'leaflet-control-fit-bounds');

        L.DomEvent.disableClickPropagation(container);
        if (!L.Browser.touch) {
            L.DomEvent.disableScrollPropagation(container);
        }

        container.title = 'Zoom to content';

        L.DomEvent.on(container, 'click', this._onClick, this);
    },

    _onClick() {
        const bounds = this._map.getLayersBounds();

        if (bounds.isValid()) {
            this._map.fitBounds(bounds);
        }
    },

});

export default function fitBounds(options) {
    return new FitBounds(options);
}