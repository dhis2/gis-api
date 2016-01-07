import L from 'leaflet';
import tileLayer from './TileLayer';
import googleLayer from './GoogleLayer';
import mapQuest from './MapQuest';
import features from './Features';
import points from './Points';
import circles from './Circles';
import markers from './Markers';
import circleMarkers from './CircleMarkers';
import choropleth from './Choropleth';
import heat from './Heat';
import grid from './Grid';
import cluster from './Cluster';
import serverCluster from './ServerCluster';
import earthEngine from './EarthEngine';


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
            tileLayer,
            mapQuest,
            googleLayer,
            features,
            points,
            circles,
            markers,
            circleMarkers,
            choropleth,
            heat,
            grid,
            cluster,
            serverCluster,
            earthEngine,
        },
        scaleControl: true,
    },

    initialize(id, opts) {
        const options = L.setOptions(this, opts);
        const baseLayers = this._baseLayers = {};
        const overlays = this._overlays = {};

        L.Map.prototype.initialize.call(this, id, options);

        L.DomUtil.addClass(this.getContainer(), options.className);

        L.Icon.Default.imagePath = '/images';

        if (options.bounds) {
            this.fitBounds(options.bounds);
        }

        if (Object.keys(baseLayers).length || Object.keys(overlays).length) {
            L.control.layers(baseLayers, overlays).addTo(this);
        }

        if (options.scaleControl) {
            L.control.scale({
                imperial: false,
            }).addTo(this);
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

            if (layer.visible === false) {
                // return; // TODO
            }
        }

        L.Map.prototype.addLayer.call(this, newLayer);

        return newLayer;
    },

    createLayer(layer) {
        return this.options.layerTypes[layer.type](layer);
    },

});

export default function map(id, options) {
    return new Map(id, options);
}
