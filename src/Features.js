import L from 'leaflet';
import '../temp/leaflet.label-src';

export const Features = L.GeoJSON.extend({

    options: {
        style: {
            color: '#555',
            weight: 1,
            fillOpacity: 0,
        },
        highlightStyle: {
            color: '#333',
            weight: 3,
        },
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);

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

/* TODO: Remove
export const Features = L.GeoJSON.extend({

    options: {
        style: {
            color: '#555',
            weight: 1,
            fillOpacity: 0,
        },
        highlightStyle: {
            color: '#333',
            weight: 3,
        },
        highlight: false,
        labelTemplate: '{na}',
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        this._layers = {};

        this.setFeatures(options.features);
        this.setData(options.data);

        // Events
        this.on('click', this.onClick, this);

        if (options.highlight) {
            this.on('mouseover', this.onMouseOver, this);
            this.on('mouseout', this.onMouseOut, this);
        }
    },

    onClick(evt) {
        const layer = evt.layer;
        const popupFunc = this.options.popup;

        if (popupFunc) {
            layer.label.close(); // Hide label

            if (popupFunc.length < 2) { // Sync
                this.addPopup(evt.latlng, popupFunc(layer.feature));
            } else { // Async if callback function
                popupFunc(layer.feature, content => {
                    this.addPopup(evt.latlng, content);
                });
            }
        }
    },

    onMouseOver(evt) {
        evt.layer.setStyle(this.options.highlightStyle);

        if (!L.Browser.ie && !L.Browser.opera) {
            evt.layer.bringToFront();
        }
    },

    onMouseOut(evt) {
        this.resetStyle(evt.layer);
    },

    setFeatures(geoFeatures) {
        if (typeof geoFeatures === 'string') { // URL
            this.loadFeatures(geoFeatures);
        } else if (typeof geoFeatures === 'object') {
            this.onLoad(geoFeatures, this._data);
        }
    },

    loadFeatures(url) {
        fetch(url)
            .then(response => response.json())
            .then(geoFeatures => this.onLoad(geoFeatures, this._data))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    onLoad(geoFeatures, data) {
        this._features = geoFeatures;
        this._data = data;

        if (geoFeatures && data) {
            this.addFeatures(this._dhis2geojson(geoFeatures, this._parseData(data)));
        } else if (geoFeatures && !this.options.data) {
            this.addFeatures(this._dhis2geojson(geoFeatures));
        }
    },

    addFeatures(geojson) {
        this.addData(geojson);
        this.addLabels(this.options.labelTemplate);
    },

    setData(data) {
        if (typeof data === 'string') { // URL
            this.loadData(data);
        } else if (typeof data === 'object') {
            this.onLoad(this._features, data);
        }
    },

    loadData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => this.onLoad(this._features, data))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addPopup(latlng, content) {
        L.popup()
            .setLatLng(latlng)
            .setContent(content)
            .openOn(this._map);
    },

    addLabels(labelTemplate) {
        this.eachLayer(layer => {
            layer.bindLabel(L.Util.template(labelTemplate, layer.feature.properties));
        });
    },

    _dhis2geojson(geoFeatures, data) {
        return {
            type: 'FeatureCollection',
            features: geoFeatures.map(d => {
                const feature = {
                    type: 'Feature',
                    id: d.id,
                    properties: d,
                };

                if (d.ty === 1) {
                    feature.geometry = {
                        type: 'Point',
                        coordinates: d.co,
                    };
                } else if (d.ty === 2) {
                    feature.geometry = {
                        type: 'MultiPolygon',
                        coordinates: JSON.parse(d.co),
                    };
                }

                if (data && data[d.id] !== undefined) {
                    feature.properties.value = data[d.id];
                }

                return feature;
            }),
        };
    },

    _parseData(data) {
        const dataObj = {};
        const values = [];
        let value;

        data.rows.forEach(d => {
            value = Number(d[2]);
            values.push(value);
            dataObj[d[1]] = value;
        });

        values.sort((a, b) => a - b);

        this._min = values[0];
        this._max = values[values.length - 1];

        return dataObj;
    },

});
*/

export default function features(options) {
    return new Features(options);
}
