// Leaflet plugin to add map layers from Google Earth Engine

import L from 'leaflet';
import {scaleLinear} from 'd3-scale';
import eeApi from 'imports?this=>window!exports?goog&ee!../../temp/ee_api_js_debug';

// Google requires these to be in the global scope
window.goog = eeApi.goog;
window.ee = eeApi.ee;

// LayerGroup is used as a Google Earth Engine visualization can consists of more than one tilelayer
export const EarthEngine = L.LayerGroup.extend({

    options: {
        url: 'https://earthengine.googleapis.com/map/{mapid}/{z}/{x}/{y}?token={token}',
        tokenType: 'Bearer',
    },

    initialize(options = {}) {
        L.setOptions(this, options);
        this._layers = {};
    },

    onAdd() {
        this.getAuthToken(this.onValidAuthToken.bind(this));
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

    // Create EE tile layer from config options (override for each layer type)
    createImage() {
        this.addImage(ee.Image(this.options.id), this.options.config);
    },

    // Add EE image to map as TileLayer
    addImage(eeImage, config = {}) {
        const eeMap = eeImage.getMap(config);

        this.addLayer(L.tileLayer(this.options.url, L.extend({
            token: eeMap.token,
            mapid: eeMap.mapid,
        }, this.options)));
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
