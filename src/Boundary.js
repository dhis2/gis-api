import {GeoJson} from './GeoJson';
import label from './Label';

export const Boundary = GeoJson.extend({

    options: {
        style: {
            opacity: 1,
            radius: 5,
            fillOpacity: 0,
        },
        highlightStyle: {
            fillOpacity: 0.1,
        },
    },

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }
        this._labels = L.layerGroup();
        GeoJson.prototype.initialize.call(this, options);
    },

    addLayer(layer) {
        const prop = layer.feature.properties;

        if (prop.style) {
            layer.setStyle(prop.style);
        }

        if (this.options.label) {
            const labelStyle = L.extend(prop.labelStyle || {}, this.options.labelStyle);
            const latlng = (layer.getBounds ? layer.getBounds().getCenter() : layer.getLatLng());

            if (prop.style.color) {
                labelStyle.color = prop.style.color;
            }

            layer._label = label(latlng, {
                html: L.Util.template(this.options.label, prop),
                labelStyle: labelStyle,
            });

            this._labels.addLayer(layer._label);
        }

        GeoJson.prototype.addLayer.call(this, layer);
    },

    setOpacity(opacity) {
        this.setStyle({
            opacity: opacity,
        });
    },

    pointToLayer(geojson, latlng) {
        return new L.CircleMarker(latlng, this.options.style);
    },

    highlight(id) {
        const layer = this.findById(id);

        this.removeHighlight();

        if (layer) {
            this._highlight = layer.setStyle({
                fillOpacity: 0.5,
            });
            return layer;
        }
    },

    removeHighlight() {
        if (this._highlight) {
            this._highlight.setStyle({
                fillOpacity: 0,
            });
        }
    },

    onAdd(map) {
        map.addLayer(this._labels);
        GeoJson.prototype.onAdd.call(this, map);
    },

    onRemove(map) {
        map.removeLayer(this._labels);
        GeoJson.prototype.onRemove.call(this, map);
    },

});

export default function boundary(options) {
    return new Boundary(options);
}
