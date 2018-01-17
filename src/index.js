// https://github.com/Leaflet/Leaflet/issues/5704

// import 'leaflet'; // Exposes global.L
import map from './Map';
import '../scss/gis-api.scss';

// Imported here to avoid Jest error
import 'script-loader!../node_modules/rbush/rbush'; // Required by Leaflet.LayerGroup.Collision
// import 'imports-loader?this=>window!../lib/ee_api_js_debug'; // Required by EarthEngine
import 'script-loader!../lib/ee_api_js_debug'; // Required by EarthEngine

// When this file was included in EarthEngine.js it caused error when running tests:
// TypeError: undefined is not an object (evaluating 'goog.global.navigator')
// This file is never loaded by test scripts
// import 'script-loader!../lib/ee_api_js_debug';

export default map;
