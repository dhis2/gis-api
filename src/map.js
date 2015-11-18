import L from 'leaflet';
import '../temp/Google'; // TODO: Fix when Google repo is compatible with Leaflet 1.0
import cluster from './cluster';

export const Map = L.Map.extend({

    options: {
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

    initialize(id, options) {
        const mapOptions = L.setOptions(this, options);
        L.Map.prototype.initialize.call(this, id, mapOptions);

        L.Icon.Default.imagePath = '/images';

        if (mapOptions.showLayersControl) {
            this.addLayersControl(mapOptions.baseLayers);
        }

        if (mapOptions.baseLayer) {
            this.setBaseLayer(mapOptions.baseLayer);
        }

        if (mapOptions.cluster) {
            this.addCluster(mapOptions.cluster);
        }

        if (mapOptions.bounds) {
            this.fitBounds(mapOptions.bounds);
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

    addCluster(source) {
        cluster(source).addTo(this);
    },

});

export default function map(id, options) {
    return new Map(id, options);
}
