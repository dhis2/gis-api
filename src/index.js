import map from './Map';
import '../scss/gis-api.scss';

// When this file was included in EarthEngine.js it caused error when running tests:
// TypeError: undefined is not an object (evaluating 'goog.global.navigator')
// This file is never loaded by test scripts
// import 'script-loader!../lib/ee_api_js_debug';

export default map;
