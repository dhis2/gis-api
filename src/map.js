import L from 'leaflet';
import '../temp/Google'; // TODO: Fix when Google repo is compatible with Leaflet 1.0
import choropleth from './choropleth';
import cluster from './cluster';
import earthEngine from './earthengine';

export const Map = L.Map.extend({

    options: {
        className: 'leaflet-dhis2',
        baseLayer: 'OpenStreetMap', // Default base layer
        baseLayers: {
            'OpenStreetMap': L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                subdomains: '1234',
                attribution: '&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> and contributors, under an <a href="http://www.openstreetmap.org/copyright" title="ODbL">open license</a>. Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
            }),
            'Google Roads': new L.Google('ROADMAP'),
        },
        showLayersControl: true,
    },

    initialize(id, mapOptions) {
        L.Map.prototype.initialize.call(this, id, mapOptions);
        const options = this.options;

        L.DomUtil.addClass(this.getContainer(), options.className);

        L.Icon.Default.imagePath = '/images';

        if (options.showLayersControl) {
            this.addLayersControl(options.baseLayers);
        }

        if (options.baseLayer) {
            this.setBaseLayer(options.baseLayer);
        }

        if (options.earthEngine) {
            this.addEarthEngine(options.earthEngine);
        }

        if (options.choropleth) {
            this.addChoropleth(options.choropleth);
        }

        if (options.cluster) {
            this.addCluster(options.cluster);
        }

        if (options.bounds) {
            this.fitBounds(options.bounds);
        }
    },

    setBaseLayer(layerName) {
        if (this.options.baseLayers[layerName]) {
            this.options.baseLayers[layerName].addTo(this);
        }
    },

    addLayersControl(baseLayers, overlays) {
        this._layersControl = L.control.layers(baseLayers, overlays).addTo(this);
    },

    addChoropleth(source) {
        return choropleth(source).addTo(this);
    },

    /**
     * addCluster() adds and returns a new cluster
     *
     * @param {String|Object} source
     * @return {Cluster} cluster
     */
    addCluster(source) {
        return cluster(source).addTo(this);
    },

    addEarthEngine(mapId) {
        return earthEngine(mapId).addTo(this);
    },

});

export default function map(id, options) {
    return new Map(id, options);
}
