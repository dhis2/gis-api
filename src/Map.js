import L from 'leaflet';
import 'leaflet-geocoder-mapzen';
import tileLayer from './TileLayer';
import mapQuest from './MapQuest';
import googleLayer from './GoogleLayer';
import boundary from './Boundary';
import dots from './Dots';
import markers from './Markers';
import circles from './Circles';
import choropleth from './Choropleth';
import clientCluster from './cluster/ClientCluster';
import serverCluster from './cluster/ServerCluster';
import legend from './Legend';
import fitBounds from './FitBounds';
// import earthEngine from './EarthEngine';
import elevation from './earthengine/Elevation';
import population from './earthengine/Population';
import nightLights from './earthengine/NightLights';

/**
 * Creates a map instance.
 * @class Map
 * @param {string|Element} id HTML element to initialize the map in (or element id as string)
 * @param {Object} options
 * @param {number} [options.minZoom=0] Minimum zoom of the map
 * @param {number} [options.maxZoom=20] Maximum zoom of the map
 * @example
 * map('mapDiv', {
 *   bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
 * });
 */
export const Map = L.Map.extend({
    options: {
        className: 'leaflet-dhis2',
        layerTypes: {
            tileLayer,      // CartoDB basemap
            mapQuest,       // MapQuest basemap
            googleLayer,    // Google basemap
            boundary,       // Boundary layer
            dots,           // Event layer without clustering
            markers,        // Facility layer
            circles,        // Facility layer circular area
            choropleth,     // Thematic layer
            clientCluster,  // Event layer
            serverCluster,  // Event layer
            elevation,      // Google Earth Engine layer
            population,     // Google Earth Engine layer
            nightLights,    // Google Earth Engine layer
        },
        controlTypes: {
            legend,
            fitBounds,
        },
        zoomControl: false,
        controls: [],
    },

    initialize(id, opts) {
        const options = L.setOptions(this, opts);
        const baseLayers = this._baseLayers = {};
        const overlays = this._overlays = {};

        L.Map.prototype.initialize.call(this, id, options);

        this.attributionControl.setPrefix('');

        L.DomUtil.addClass(this.getContainer(), options.className);

        L.Icon.Default.imagePath = '/images';

        // Stop propagation to prevent dashboard dragging
        this.on('mousedown', e => {
            e.originalEvent.stopPropagation();
        });

        if (options.bounds) {
            this.fitBounds(options.bounds);
        }

        if (Object.keys(baseLayers).length || Object.keys(overlays).length) {
            L.control.layers(baseLayers, overlays).addTo(this);
        }

        for (const control of options.controls) {
            this.addControl(control);
        }
    },

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

        this.eachLayer(layer => {
            if (layer.getBounds) {
                bounds.extend(layer.getBounds());
            }
        });

        return bounds;
    },

    toggleLoader(show) {
        const container = this._containter;
        const className = 'leaflet-loader';
        const hasClass = L.DomUtil.hasClass(container, className);

        if (hasClass && show !== true) {
            L.DomUtil.removeClass(container, className);
        } else {
            L.DomUtil.addClass(container, className);
        }
    },

});

export default function map(id, options) {
    return new Map(id, options);
}
