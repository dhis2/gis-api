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

/**
 * Creates a map instance.
 * @class D2Map
 * @param {string|Element} id HTML element to initialize the map in (or element id as string)
 * @param {Object} options
 * @param {number} [options.minZoom=0] Minimum zoom of the map
 * @param {number} [options.maxZoom=20] Maximum zoom of the map
 * @example
 * map('mapDiv', {
 *   bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
 * });
 */
export const D2Map = L.Map.extend({
    options: {
        className: 'leaflet-dhis2',
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
        zoomControl: false,
        controls: [],
        worldCopyJump: true,
        maxZoom: 18,
    },

    initialize(id, opts) {
        const options = L.setOptions(this, opts);

        this._baseLayers = {};
        this._overlays = {};

        L.Map.prototype.initialize.call(this, id, options);

        this.attributionControl.setPrefix('');

        L.DomUtil.addClass(this.getContainer(), options.className);

        L.Icon.Default.imagePath = '/images/';

        // Stop propagation to prevent dashboard dragging
        // TODO: Move to dashboard map
        this.on('mousedown', (e) => {
            e.originalEvent.stopPropagation();
        });

        if (options.bounds) {
            this.fitBounds(options.bounds);
        }

        /* Don't work in IE 11
        for (const control of options.controls) {
            this.addControl(control);
        }
        */

        for (const control in options.controls) { // eslint-disable-line
            if (options.controls.hasOwnProperty(control)) {
                this.addControl(control);
            }
        }
    },

    // Override method to accept nye layer as config object
    addLayer(layer) {
        const layerTypes = this.options.layerTypes;
        let newLayer = layer;

        // console.log('layer', layer.type, layer);

        if (layer.type && layerTypes[layer.type]) {
            newLayer = this.createLayer(layer);

            if (layer.baseLayer === true) {
                this._baseLayers[layer.name] = newLayer;
            } else if (layer.overlay === true) {
                this._overlays[layer.name] = newLayer;
            }
        }

        L.Map.prototype.addLayer.call(this, newLayer);

        return newLayer;
    },

    createLayer(layer) {
        return this.options.layerTypes[layer.type](layer);
    },

    addControl(control) {
        const controlTypes = this.options.controlTypes;
        let newControl = control;

        if (control.type && controlTypes[control.type]) {
            newControl = controlTypes[control.type](control);
        } else if (control.type && L.control[control.type]) {
            newControl = L.control[control.type](control);
        }

        L.Map.prototype.addControl.call(this, newControl);
        return newControl;
    },

    // Returns combined bounds for non-tile layers
    getLayersBounds() {
        const bounds = new L.LatLngBounds();

        this.eachLayer((layer) => {
            // TODO: Calculating bounds for circles layer (radius around facilitites) gives errors. Happends for dashboard maps
            if (layer.getBounds && layer.options.type !== 'circles') {
                bounds.extend(layer.getBounds());
            }
        });

        return bounds;
    },

});

export default function map(id, options) {
    return new D2Map(id, options);
}
