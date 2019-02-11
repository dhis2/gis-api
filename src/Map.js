import L from 'leaflet';
import tileLayer from './layers/TileLayer';
import wmsLayer from './layers/WmsLayer';
import googleLayer from './layers/GoogleLayer';
import geoJson from './layers/GeoJson';
import boundary from './layers/Boundary';
import buffer from './layers/Buffer';
import dots from './layers/Dots';
import markers from './layers/Markers';
import circles from './layers/Circles';
import choropleth from './layers/Choropleth';
import clientCluster from './layers/ClientCluster';
import serverCluster from './layers/ServerCluster';
import earthEngine from './layers/EarthEngine';
import legend from './controls/Legend';
import fitBounds from './controls/FitBounds';
import search from './controls/Search';
import measure from './controls/Measure';

export class Map extends L.Evented {
    options = {
        className: 'leaflet-dhis2',
        zoomControl: false,
        controls: [],
        worldCopyJump: true,
        maxZoom: 18,
        layerTypes: {
            tileLayer,      // CartoDB basemap
            wmsLayer,       // WMS layer
            googleLayer,    // Google basemap
            geoJson,        // GeoJSON layer
            boundary,       // Boundary layer
            buffer,         // Buffer layer
            dots,           // Event layer without clustering
            markers,        // Facility layer
            circles,        // Facility layer circular area
            choropleth,     // Thematic layer
            clientCluster,  // Event layer
            serverCluster,  // Event layer
            earthEngine,    // Google Earth Engine layer
        },
        controlTypes: {
            legend,
            fitBounds,
            search,
            measure,
        },
    }

    constructor(el, opts) {
        super();

        const options = L.setOptions(this, opts);

        this._baseLayers = {};
        this._overlays = {};
        this._layers = [];

        this._map = L.map(el, options);

        this._map.attributionControl.setPrefix('');

        L.DomUtil.addClass(this.getContainer(), options.className);

        L.Icon.Default.imagePath = '/images/';

        // Stop propagation to prevent dashboard dragging
        // TODO: Move to dashboard map
        this._map.on('mousedown', evt => evt.originalEvent.stopPropagation());

        if (options.bounds) {
            this.fitBounds(options.bounds);
        }

        for (const control in options.controls) { // eslint-disable-line
            if (options.controls.hasOwnProperty(control)) {
                this.addControl(control);
            }
        }

        this._map.on("contextmenu", evt => this.onContextMenu(evt));
    }

    getContainer() {
        return this._map.getContainer();
    }

    getLeafletMap() {
        return this._map;
    }

    // Accept layer as config object
    addLayer(layer) {
        const layerTypes = this.options.layerTypes;
        let newLayer = layer;

        if (layer.type && layerTypes[layer.type]) {
            newLayer = this.createLayer(layer);
        }

        newLayer.createPane(this._map);

        this._map.addLayer(newLayer);
        this._layers.push(newLayer);

        return newLayer;
    }

    removeLayer(layer) {
        this._layers = this._layers.filter(l => l !== layer);
        return this._map.removeLayer(layer);
    }

    hasLayer(layer) {
        return this._map.hasLayer(layer);
    }

    remove() {
        this._map.remove();
    }

    createLayer(layer) {
        return this.options.layerTypes[layer.type](layer);
    }

    addControl(control) {
        const controlTypes = this.options.controlTypes;
        let newControl = control;

        if (control.type && controlTypes[control.type]) {
            newControl = controlTypes[control.type](control);
        } else if (control.type && L.control[control.type]) {
            newControl = L.control[control.type](control);
        }

        this._map.addControl(newControl);
        return newControl;
    }

    fitBounds(bounds) {
        this._map.fitBounds(bounds);
    }

    getLayers() {
        return this._layers;
    }

    // Returns true if the layer type is supported
    hasLayerSupport(type) {
        return !!this.options.layerTypes[type];
    }

    openPopup(content, coordinates) {
        const [lng, lat] = coordinates;
        this._map.openPopup(content, [lat, lng]);
    }

    resize() {
      this._map.invalidateSize();
    }

    onContextMenu(evt) {
        const { type, latlng, originalEvent } = evt; 
        const coordinates = [latlng.lng, latlng.lat]; 
        const position = [originalEvent.x, originalEvent.pageY || originalEvent.y];

        this.fire('contextmenu', { type, coordinates, position });
    }  

}

export default Map;
