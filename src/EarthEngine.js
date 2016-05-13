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
        var accessToken = this.options.accessToken;

        if (accessToken) {
            if (accessToken instanceof Function) {
                accessToken(this.onValidAccessToken.bind(this));
            } else {
                this.onValidAccessToken(accessToken);
            }
        }

        this._initContainer();
    },

    // TODO: Call on token expiry
    onValidAccessToken(token) {
        const options = this.options;

        // https://github.com/google/earthengine-api/blob/07052aa5c168639f134501765df2a2a7ae2f1d6f/javascript/src/data.js#L174
        ee.data.setAuthToken(token.client_id, this.options.tokenType, token.access_token, token.expires_in); // (token.expiryDate - Date.now()) / 1000

        ee.initialize();

        var eeMapConfig = ee.Image(options.id).getMap(options.config || {});

        options.token = eeMapConfig.token;
        options.mapid = eeMapConfig.mapid;

        // console.log("addToMap");

        L.TileLayer.prototype.onAdd.call(this);
        this.fire('initialized');

        //console.log(options, this._map);
    },

    // Check validity of token
    // https://play.dhis2.org/dev/api/tokens/google
    /*
    getToken(callback) {
        callback({
            "access_token": "ya29.CjbhAoAidecNEDUboG33aMlCYd2mxPDwHUEdTctB17JwX5nqGfldRDqGky2SvtfrH1ipG3tkiYg",
            "expires_in": 3600,
            "client_id": "101611861269198612525"
        });
    },
    */

});

export default function earthEngine(options) {
    return new EarthEngine(options);
}
