import L from 'leaflet';
import '../temp/leaflet.label-src';

export const Features = L.GeoJSON.extend({

    options: {
        style: {
            color: '#555',
            weight: 2,
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

        if (options.data) {
            this.setFeatureData(options.data);
            this._featureData = true;
        }

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

    setFeatures(features) {
        if (typeof features === 'string') { // URL
            this.loadFeatures(features);
        } else if (typeof features === 'object') {
            this.addFeatures(features);
        }
    },

    loadFeatures(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addFeatures.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addFeatures(features) {
        //this._geojson = this._dhis2geojson(features);
        this.addData(this._dhis2geojson(features));
        this.addLabels(this.options.labelTemplate);
        /*
        if (features) {
            this._geojson = features;

            if (Array.isArray(features)) {
                this._geojson = this._dhis2geojson(features);
            }

            this.addData(this._geojson);
            this.addLabels(this.options.labelTemplate);
        }
        */
    },

    setFeatureData(data) {
        if (typeof data === 'string') { // URL
            this.loadFeatureData(data);
        } else if (typeof features === 'object') {
            this.addFeatureData(data);
        }
    },

    loadFeatureData(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addFeatureData.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addFeatureData(data) {
        if (this._geojson && data) {
            //this._data = this.parseFeatureData(data);

            console.log("addFeatureData", this._geojson, data);
        }
    },

    // Convert array to object for easier lookup
    parseFeatureData(data) {
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

    _dhis2geojson(features, data) {
        return {
            type: 'FeatureCollection',
            features: features.map(d => {
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

                return feature;
            }),
        };
    },

});

export default function features(options) {
    return new Features(options);
}
