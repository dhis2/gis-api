import L from 'leaflet';
import '../temp/leaflet.label-src';

export const Points = L.GeoJSON.extend({

    options: {
        style: {
            radius: 6,
            color: '#fff',
            weight: 1,
            fillColor: '#000',
            fillOpacity: 0.7,
        },
        highlightStyle: {
            weight: 2,
        },
        highlight: true,
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);

        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        this._layers = {};

        if (options.data) {
            this.addData(options.data);
        }
    },

    addLayer(layer) {
        const options = this.options;
        const feature = layer.feature;

        if (options.label) {
            layer.bindLabel(L.Util.template(options.label, feature.properties));
        }

        if (options.popup) {
            layer.bindPopup(L.Util.template(options.popup, feature.properties));
        }

        L.GeoJSON.prototype.addLayer.call(this, layer);
    },

    pointToLayer(feature, latlng) {
        return L.circleMarker(latlng);
    },

    onAdd(map) {
        L.GeoJSON.prototype.onAdd.call(this, map);

        if (this.options.highlightStyle) {
            this.on('mouseover', this.onMouseOver, this);
            this.on('mouseout', this.onMouseOut, this);
        }
    },

    onRemove(map) {
        L.GeoJSON.prototype.onRemove.call(this, map);

        if (this.options.highlightStyle) {
            this.off('mouseover', this.onMouseOver, this);
            this.off('mouseout', this.onMouseOut, this);
        }
    },

    // Set highlight style
    onMouseOver(evt) {
        evt.layer.setStyle(this.options.highlightStyle);

        if (!L.Browser.ie && !L.Browser.opera) {
            evt.layer.bringToFront();
        }
    },

    // Reset style
    onMouseOut(evt) {
        this.resetStyle(evt.layer);
    },

});

export default function points(options) {
    return new Points(options);
}
