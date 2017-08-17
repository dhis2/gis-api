// Leaflet plugin to add map layers from Google Earth Engine

import L from 'leaflet';
import 'script-loader!../lib/ee_api_js_debug';

// LayerGroup is used as a Google Earth Engine visualization can consists of more than one tilelayer
// TODO: Change to TileLayer
export const EarthEngine = L.LayerGroup.extend({

    options: {
        url: 'https://earthengine.googleapis.com/map/{mapid}/{z}/{x}/{y}?token={token}',
        tokenType: 'Bearer',
        aggregation: 'none',
        popup: '{name}: {value} {unit}',
    },

    initialize(options = {}) {
        L.setOptions(this, options);
        this._layers = {};
        this._legend = options.legend || this.createLegend();
    },

    onAdd() {
        this.getAuthToken(this.onValidAuthToken.bind(this));
    },

    onRemove(map) {
        if (this._popup) {
            map.closePopup(this._popup);
        }
        L.GeoJSON.prototype.onRemove.call(this, map);
    },

    // Get OAuth2 token needed to create and load Google Earth Engine layers
    getAuthToken(callback) {
        const accessToken = this.options.accessToken;
        if (accessToken) {
            if (accessToken instanceof Function) { // Callback function returning auth obect
                accessToken(callback);
            } else { // Auth token as object
                callback(accessToken);
            }
        }
    },

    // Configures client-side authentication of EE API calls by providing a OAuth2 token to use.
    onValidAuthToken(token) {
        ee.data.setAuthToken(token.client_id, this.options.tokenType, token.access_token, token.expires_in, null, null, false);
        ee.data.setAuthTokenRefresher(this.refreshAccessToken.bind(this));
        ee.initialize();
        this.createImage();
        this.fire('initialized');
    },

    // Refresh OAuth2 token when expired
    refreshAccessToken(authArgs, callback) {
        const self = this;
        this.getAuthToken(token => {
            callback({
                token_type: self.options.tokenType,
                access_token: token.access_token,
                state: authArgs.scope,
                expires_in: token.expires_in,
            });
        });
    },

    // Create EE tile layer from params (override for each layer type)
    createImage() {
        const options = this.options;

        let eeCollection;
        let eeImage;

        if (options.filter) { // Image collection
            eeCollection = ee.ImageCollection(options.id); // eslint-disable-line

            eeCollection = this.applyFilter(eeCollection);

            if (options.aggregation === 'mosaic') {
                this.eeCollection = eeCollection;
                eeImage = eeCollection.mosaic();
            } else {
                eeImage = ee.Image(eeCollection.first()); // eslint-disable-line
            }
        } else { // Single image
            eeImage = ee.Image(options.id); // eslint-disable-line
        }

        if (options.band) {
            eeImage = eeImage.select(options.band);
        }

        if (options.mask) { // Mask out 0-values
            eeImage = eeImage.updateMask(eeImage.gt(0));
        }

        // Run methods on image
        eeImage = this.runMethods(eeImage);

        this.eeImage = eeImage;

        // Classify image
        if (!options.legend) { // Don't classify if legend is provided
            eeImage = this.classifyImage(eeImage);
        }

        this.addLayer(this.visualize(eeImage));
    },

    // Add EE image to map as TileLayer
    addLayer(eeImage) {
        const eeMap = eeImage.getMap();
        const layer = L.tileLayer(this.options.url, L.extend({
            token: eeMap.token,
            mapid: eeMap.mapid,
        }, this.options));

        L.LayerGroup.prototype.addLayer.call(this, layer);
    },

    applyFilter(collection, filterOpt) {
        const filter = filterOpt || this.options.filter;

        if (filter) {
            /* Don't work in IE 11
            for (const item of filter) {
                collection = collection.filter(ee.Filter[item.type].apply(this, item.arguments));  // eslint-disable-line
            }
            */

            for (const item in filter) { // eslint-disable-line
                if (filter.hasOwnProperty(item)) {
                    collection = collection.filter(ee.Filter[item.type].apply(this, item.arguments));  // eslint-disable-line
                }
            }
        }

        return collection;
    },

    // Run methods on image
    // https://code.earthengine.google.com/a19f5cec73720aba049b457d55672cee
    // https://code.earthengine.google.com/37e4e9cc4436a22e5c3e0f63acb4c0bc
    runMethods(image) {
        const methods = this.options.methods;
        let eeImage = image;

        if (methods) {
            Object.keys(methods).forEach(method => {
                if (eeImage[method]) { // Make sure method exist
                    eeImage = eeImage[method].apply(eeImage, methods[method]);
                }
            });
        }

        return eeImage;
    },

    // Classify image according to legend
    classifyImage(eeImage) {
        const legend = this._legend;
        let zones;

        for (let i = 0, item; i < legend.length - 1; i++) {
            item = legend[i];
            if (!zones) {
                zones = eeImage.gt(item.to);
            } else {
                zones = zones.add(eeImage.gt(item.to));
            }
        }

        return zones;
    },

    // Visualize image (turn into RGB)
    visualize(eeImage) {
        const options = this.options;

        return eeImage.visualize(options.legend ? options.params : {
            min: 0,
            max: this._legend.length - 1,
            palette: options.params.palette,
        });
    },

    createLegend() {
        const params = this.options.params;
        const min = params.min;
        const max = params.max;
        const palette = params.palette.split(',');
        const step = (params.max - min) / (palette.length - (min > 0 ? 2 : 1));

        let from = min;
        let to = Math.round(min + step);

        return palette.map((color, index) => {
            const item = {
                color: color,
            };

            if (index === 0 && min > 0) { // Less than min
                item.from = 0;
                item.to = min;
                item.name = '< ' + item.to;
                to = min;
            } else if (from < max) {
                item.from = from;
                item.to = to;
                item.name = item.from + ' - ' + item.to;
            } else { // Higher than max
                item.from = from;
                item.name = '> ' + item.from;
            }

            from = to;
            to = Math.round(min + (step * (index + (min > 0 ? 1 : 2))));

            return item;
        });
    },

    // Returns a HTML legend for this EE layer
    getLegend() {
        const options = this.options;
        let legend = '<div class="dhis2-legend">';

        legend += '<h2>' + options.name;

        if (options.image) {
            legend += ' ' + options.image;
        }

        legend += '</h2>';

        if (options.description) {
            legend += '<p>' +  options.description + '</p>';
        }

        legend += '<dl>';

        if (options.unit) {
            legend += '<dt></dt><dd><strong>' + options.unit + '</strong></dd>';
        }

        for (let i = 0, item; i < this._legend.length; i++) {
            item = this._legend[i];
            legend += '<dt style="background-color:' + item.color + ';box-shadow:1px 1px 2px #aaa;"></dt>';
            legend += '<dd>' + item.name;
        }

        legend += '</dl>';

        if (options.source) {
            if (options.sourceUrl) {
                legend += '<p>Source: <a href="' + options.sourceUrl + '">' + options.source + '</a></p>';
            } else {
                legend += '<p>Source: ' + options.source + '</p>';
            }
        }

        legend += '<div>';

        return legend;
    },

    setOpacity(opacity) {
        this.options.opacity = opacity;
        this.eachLayer(layer => layer.setOpacity(opacity));
    },

    // Returns value at location in a callback
    getValue(latlng, callback) {
        const point = ee.Geometry.Point(latlng.lng, latlng.lat); // eslint-disable-line
        const options = this.options;
        let dictionary;

        if (options.aggregation === 'mosaic') {
            dictionary = this.eeImage.reduceRegion(ee.Reducer.mean(), point, options.resolution, options.projection);
        } else {
            dictionary = this.eeImage.reduceRegion(ee.Reducer.mean(), point);
        }

        dictionary.getInfo(valueObj => {
            const band = options.band || Object.keys(valueObj)[0];
            let value = valueObj[band];

            if (options.legend && options.legend[value]) {
                value = options.legend[value].name;
            } else if (options.value) { // Needs calculation
                value = options.value(value);
            }

            callback(value);
        });
    },

    // Shows the value at location (popup)
    showValue(latlng) {
        const options = this.options;
        this.getValue(latlng, value => {
            this._popup = L.popup()
                .setLatLng(latlng)
                .setContent(L.Util.template(options.popup, L.extend({}, options, {
                    value: value,
                })))
                .openOn(this._map);
        });
    },

});

export default function earthEngine(options) {
    return new EarthEngine(options);
}
