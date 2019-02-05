import L from 'leaflet';

// Adds a fit map to contents button
export const FitBounds = L.Control.extend({

    options: {
        position: 'topleft',
    },

    onAdd(map) {
        this._map = map;
        this._initLayout();
        this._toggleControl(this._getLayersBounds().isValid());

        map.on('layeradd', this._onLayerChange, this);
        map.on('layerremove', this._onLayerChange, this);

        return this._container;
    },

    onRemove(map) {
        map.off('layeradd', this._onLayerChange, this);
        map.off('layerremove', this._onLayerChange, this);
        L.Control.prototype.onRemove.call(this, map);
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

    // Returns combined bounds for non-tile layers
    _getLayersBounds() {
        const bounds = new L.LatLngBounds();

        this._map.eachLayer((layer) => {
            // TODO: Calculating bounds for circles layer (radius around facilitites) gives errors. Happens for dashboard maps
            if (layer.getBounds && layer.options.type !== 'circles') {
                bounds.extend(layer.getBounds());
            }
        });

        return bounds;
    },

    _onClick() {
        const bounds = this._getLayersBounds();

        if (bounds.isValid()) {
            this._map.fitBounds(bounds);
        }
    },

    _onLayerChange(evt) {
        if (evt.layer instanceof L.FeatureGroup) {
            this._toggleControl(this._getLayersBounds().isValid());
        }
    },

    // Only show control when map contains "fittable" content
    _toggleControl(isValidBounds) {
        if (isValidBounds) {
            this._container.style.display = 'block';
        } else {
            this._container.style.display = 'none';
        }
    },

});

export default function fitBounds(options) {
    return new FitBounds(options);
}
