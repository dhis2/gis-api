// Base class for most vector layers

import L from 'leaflet';
import label from './Label';
import polylabel from 'polylabel';
import 'script!../node_modules/rbush/rbush'; // Required by Leaflet.LayerGroup.Collision
import '../node_modules/leaflet.layergroup.collision/src/Leaflet.LayerGroup.Collision';
const geojsonArea = require('geojson-area');

export const GeoJson = L.GeoJSON.extend({

    options: {
        highlightStyle: {
            weight: 2,
        },
        resetStyle: {
            weight: 1,
        },
    },

    initialize(options = {}) {
        if (options.label) {
            this._labels = L.layerGroup.collision({ margin: 2 });
        }

        L.GeoJSON.prototype.initialize.call(this, options.data, options);
    },

    addLayer(layer) {
        const options = this.options;
        const feature = layer.feature;

        // Add text label
        if (this.options.label) {
            this.addLabel(layer, L.Util.template(this.options.label, feature.properties));
        }

        if (options.hoverLabel || options.label) {
            layer.bindTooltip(L.Util.template(options.hoverLabel || options.label, feature.properties), {
                sticky: true,
            });
        }

        if (options.popup && !(options.popup instanceof Function)) {
            layer.bindPopup(L.Util.template(options.popup, feature.properties));
        }

        L.GeoJSON.prototype.addLayer.call(this, layer);
    },

    // Add label to layer
    addLabel(layer, text) {
        const prop = layer.feature.properties;
        const geometry = layer.feature.geometry;
        const labelStyle = L.extend(prop.labelStyle || {}, this.options.labelStyle);
        const latlng = this._getLabelLatlng(geometry);

        if (prop.style && prop.style.color) {
            labelStyle.color = prop.style.color;
        }

        layer._label = label(latlng, {
            html: text,
            position: geometry.type === 'Point' ? 'below' : 'middle',
            labelStyle: labelStyle,
        });

        this._labels.addLayer(layer._label);
    },

    setOpacity(opacity) {
        this.setStyle({
            opacity: opacity,
            fillOpacity: opacity,
        });
    },

    findById(id) {
        for (const i in this._layers) {
            if (this._layers[i].feature.id === id) {
                return this._layers[i];
            }
        }

        return null;
    },

    onAdd(map) {
        L.GeoJSON.prototype.onAdd.call(this, map);

        if (this._labels) {
            map.addLayer(this._labels);
        }

        if (this.options.highlightStyle) {
            this.on('mouseover', this.onMouseOver, this);
            this.on('mouseout', this.onMouseOut, this);
        }

        if (this.options.contextmenu) {
            this.on('contextmenu', this.options.contextmenu);
        }
    },

    onRemove(map) {
        L.GeoJSON.prototype.onRemove.call(this, map);

        if (this._labels) {
            map.removeLayer(this._labels);
        }

        if (this.options.highlightStyle) {
            this.off('mouseover', this.onMouseOver, this);
            this.off('mouseout', this.onMouseOut, this);
        }

        if (this.options.contextmenu) {
            this.off('contextmenu', this.options.contextmenu);
        }
    },

    // Set highlight style
    onMouseOver(evt) {
        evt.layer.setStyle(this.options.highlightStyle);
    },

    // Reset style
    onMouseOut(evt) {
        evt.layer.setStyle(this.options.resetStyle);
    },

    // Returns the best label placement
    _getLabelLatlng(geometry) {
        const coords = geometry.coordinates;
        let biggestRing;

        if (geometry.type === 'Point') {
            return [coords[1], coords[0]];
        } else if (geometry.type === 'Polygon') {
            biggestRing = coords;
        } else if (geometry.type === 'MultiPolygon') {
            biggestRing = coords[0];

            // If more than one polygon, place the label on the polygon with the biggest area
            if (coords.length > 1) {
                let biggestSize = 0;

                coords.forEach(ring => {
                    const size = geojsonArea.ring(ring[0]); // Area calculation

                    if (size > biggestSize) {
                        biggestRing = ring;
                        biggestSize = size;
                    }
                });
            }
        }

        // Returns pole of inaccessibility, the most distant internal point from the polygon outline
        return polylabel(biggestRing, 2).reverse();
    },

});

export default function geoJson(options) {
    return new GeoJson(options);
}
