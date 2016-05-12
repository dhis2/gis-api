// TODO: Load on demand

import L from 'leaflet';

// https://github.com/dhis2/dhis2-gis-api/issues/3
import ee_api from 'exports?goog&ee!../temp/ee_api_js_debug'; // https://github.com/webpack/docs/wiki/shimming-modules

const goog = ee_api.goog;
const ee = ee_api.ee;

// console.log("###", goog, ee);

export const EarthEngine = L.TileLayer.extend({

    options: {
        url: 'https://earthengine.googleapis.com/map/{mapid}/{z}/{x}/{y}?token={token}',
        // view-source:http://server-auth-dot-ee-demos.appspot.com/
        tokenType: 'Bearer',
    },

    initialize(opts = {}) {
        const options = L.setOptions(this, opts);
        L.TileLayer.prototype.initialize.call(this, options.url, options);
    },

    onAdd() {
        // console.log('onAdd');

        this.getToken(this.onValidToken.bind(this));
    },

    // TODO: Call on token expiry
    onValidToken(token) {
        const options = this.options;

        // https://github.com/google/earthengine-api/blob/07052aa5c168639f134501765df2a2a7ae2f1d6f/javascript/src/data.js#L174
        ee.data.setAuthToken(token.client_id, this.options.tokenType, token.access_token, token.expires_in); // (token.expiryDate - Date.now()) / 1000

        ee.initialize();

        var eeMapConfig = ee.Image(options.id).getMap(options.config || {});

        options.token = eeMapConfig.token;
        options.mapid = eeMapConfig.mapid;

        // console.log("addToMap");

        L.TileLayer.prototype.onAdd.call(this);
        //console.log(options, this._map);
    },

    // Check validity of token
    // https://play.dhis2.org/dev/api/tokens/google
    getToken(callback) {
        callback({
            "access_token": "ya29.CjbgAsVhOCHSqFcmokdkRYl0yKciWuY6Br5pp9MAslr6euPpyqV995zdfOtv9UOEvZjCY2cJCL0",
            "expires_in": 3599,
            "client_id": "101611861269198612525"
        });
    },

});

export default function earthEngine(options) {
    return new EarthEngine(options);
}
