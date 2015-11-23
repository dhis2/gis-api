import L from 'leaflet';
import google from './Google';
import mapQuest from './MapQuest';
import choropleth from './Choropleth';
import cluster from './Cluster';
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
            mapQuest,
            google,
            choropleth,
            cluster,
            earthEngine,
        },
    },

    initialize(id, opts) {
        L.Map.prototype.initialize.call(this, id, opts);
        const options = this.options;

        L.DomUtil.addClass(this.getContainer(), options.className);

        L.Icon.Default.imagePath = '/images';

        if (options.bounds) {
            this.fitBounds(options.bounds);
        }
    },

    addLayer(layer) {
        const layerTypes = this.options.layerTypes;
        let newLayer = layer;

        if (layer.type && layerTypes[layer.type]) {
            newLayer = layerTypes[layer.type](layer);
        }

        L.Map.prototype.addLayer.call(this, newLayer);
    },

});

export default function map(id, options) {
    return new Map(id, options);
}
