import tileLayer from "./layers/TileLayer";
import wmsLayer from "./layers/WmsLayer";
import googleLayer from "./layers/GoogleLayer";
import geoJson from "./layers/GeoJsonGroup";
import boundary from "./layers/Boundary";
import dots from "./layers/Dots";
import markers from "./layers/Markers";
import choropleth from "./layers/Choropleth";
import clientCluster from "./layers/ClientCluster";
import serverCluster from "./layers/ServerCluster";
import earthEngine from "./layers/EarthEngine";
import group from "./layers/LayerGroup";

export default {
  tileLayer, // CartoDB basemap
  wmsLayer, // WMS layer
  googleLayer, // Google basemap
  geoJson, // GeoJSON layer
  boundary, // Boundary layer
  dots, // Event layer without clustering
  markers, // Facility layer
  choropleth, // Thematic layer
  clientCluster, // Event layer
  serverCluster, // Event layer
  earthEngine, // Google Earth Engine layer
  group // A collection of layers
};
