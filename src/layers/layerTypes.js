import tileLayer from './TileLayer'
import wmsLayer from './WmsLayer'
import googleLayer from './GoogleLayer'
import geoJson from './GeoJsonGroup'
import boundary from './Boundary'
import events from './Events'
import markers from './Markers'
import choropleth from './Choropleth'
import clientCluster from './ClientCluster'
import serverCluster from './ServerCluster'
import earthEngine from './EarthEngine'
import group from './LayerGroup'

export default {
    tileLayer, // CartoDB basemap
    wmsLayer, // WMS layer
    googleLayer, // Google basemap
    geoJson, // GeoJSON layer
    boundary, // Boundary layer
    events, // Event layer without clustering
    markers, // Facility layer
    choropleth, // Thematic layer
    clientCluster, // Event layer
    donutCluster: clientCluster, // Event layer, not supported in GIS API, fallback to clientCluster
    serverCluster, // Event layer
    earthEngine, // Google Earth Engine layer
    group, // A collection of layers
}
