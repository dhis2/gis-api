import EventEmitter from "events";
import L from 'leaflet';
import tileLayer from './TileLayer';
import wmsLayer from './WmsLayer';
import googleLayer from './GoogleLayer';
import geoJson from './GeoJson';
import boundary from './Boundary';
import buffer from './Buffer';
import dots from './Dots';
import markers from './Markers';
import circles from './Circles';
import choropleth from './Choropleth';
import clientCluster from './cluster/ClientCluster';
import serverCluster from './cluster/ServerCluster';
import earthEngine from './EarthEngine';
import legend from './Legend';
import fitBounds from './FitBounds';
import search from './Search';
import measure from './Measure';

export class Map extends EventEmitter {
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

            if (layer.baseLayer === true) {
                this._baseLayers[layer.name] = newLayer;
            } else if (layer.overlay === true) {
                this._overlays[layer.name] = newLayer;
            }
        }

        this._map.addLayer(newLayer);

        return newLayer;
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

    // TODO: Should not be exposed
    createPane(name, container) {
        this._map.createPane(name, container);
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

    // TODO: Probably not needed
    getLayers() {
        return [];
    }

    // Returns combined bounds for non-tile layers
    getLayersBounds() {
        const bounds = new L.LatLngBounds();

        console.log('getLayersBounds');

        this._map.eachLayer((layer) => {
            // TODO: Calculating bounds for circles layer (radius around facilitites) gives errors. Happens for dashboard maps
            if (layer.getBounds && layer.options.type !== 'circles') {
              bounds.extend(layer.getBounds());
            }
        });

        return bounds;
    }

    resize() {
      this._map.invalidateSize();
    }

    setPopup(latlng, content) {
        return L.popup()
          .setLatLng(latlng)
          .setContent(content)
          .openOn(this._map);
    }

    onContextMenu(evt) {
        const { latlng, originalEvent } = evt; 
        // L.DomEvent.stopPropagation(evt); // Proably not needed here

        this.emit('contextmenu', {
            coordinates: [latlng.lng, latlng.lat],
            latlng: evt.latlng,
            position: [
                originalEvent.x,
                originalEvent.pageY || originalEvent.y,
            ],
        });
    }  
}

export default Map;
