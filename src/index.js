import Map from "./Map";
import "../scss/gis-api.scss";

// When this file was included in EarthEngine.js it caused error when running tests
// This file is never loaded by test scripts
import "script-loader!@google/earthengine/build/ee_api_js";

export default Map;
