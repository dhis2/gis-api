// Leaflet plugin to add map layers from Google Earth Engine

import L from 'leaflet';
import {scaleLinear} from 'd3-scale';
import eeApi from 'imports?this=>window!exports?goog&ee!../temp/ee_api_js_debug';

const goog = eeApi.goog; // eslint-disable-line
const ee = eeApi.ee;

export const EarthEngine = L.TileLayer.extend({

    options: {
        url: 'https://earthengine.googleapis.com/map/{mapid}/{z}/{x}/{y}?token={token}',
        tokenType: 'Bearer',
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        L.TileLayer.prototype.initialize.call(this, options.url, options);
    },

    onAdd() {
        this.getAuthToken(this.onValidAuthToken.bind(this));
        this._initContainer();
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
        this.createLayer();
    },

    // Refresh OAuth2 token when expired
    refreshAccessToken(authArgs, callback) {
        var self = this;
        this.getAuthToken(function(token) {
            callback({
                token_type: self.options.tokenType,
                access_token: token.access_token,
                state: authArgs.scope,
                expires_in: token.expires_in
            });
        });
    },

    // Create EE tile layer from config options
    createLayer() {
        const options = this.options;
        let eeImage;

        if (!options.filter) { // Single image
            eeImage = ee.Image(options.id); // eslint-disable-line
        } else { // Image collection
            let collection = ee.ImageCollection(options.id); // eslint-disable-line

            for (const filter of options.filter) {
                collection = collection.filter(ee.Filter[filter.type].apply(this, filter.arguments));  // eslint-disable-line
                eeImage = collection.mosaic();
            }
        }

        const eeMapConfig = eeImage.getMap(options.config || {});

        options.token = eeMapConfig.token;
        options.mapid = eeMapConfig.mapid;

        L.TileLayer.prototype.onAdd.call(this);
        this.fire('initialized');
    },

    // Returns a HTML legend for this EE layer
    getLegend() {
        const options = this.options;
        const config = this.options.config;
        const palette = config.palette.split(',');
        const ticks = scaleLinear().domain([config.min, config.max]).ticks(palette.length);
        const colorScale = scaleLinear().domain(ticks).range(palette);

        let legend = '<div class="dhis2-legend"><h2>' + options.name + '</h2>';

        if (options.description) {
            legend += '<p>' +  options.description + '</p>';
        }

        legend += '<dl>';

        for (let value of ticks) {
            legend += '<dt style="background-color:' + colorScale(value) + ';box-shadow:1px 1px 2px #aaa;"></dt>';
            legend += '<dd>' + value + ' ' + (options.unit || '') + '</dd>';
        }

        legend += '</dl>';

        if (options.attribution) {
            legend += '<p>Data: ' + options.attribution + '</p>';
        }

        legend += '<div>';

        return legend;
    },

});

export default function earthEngine(options) {
    return new EarthEngine(options);
}

