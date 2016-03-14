import L from 'leaflet';
import clusterIcon from './ClusterIcon';
import {scaleLinear} from 'd3-scale';
import '../../temp/leaflet.markercluster-src'; // TODO: Remove when cluster repo is compatible with Leaflet 1.0

export const ClientCluster = L.MarkerClusterGroup.extend({

    options: {
        maxClusterRadius: 60,
        showCoverageOnHover: false,
        iconCreateFunction(cluster) {
            const count = cluster.getChildCount();
            const size = this.scale(count);

            cluster.options.opacity = this.opacity;

            return clusterIcon({
                color: this.color,
                opacity: this.opacity,
                iconSize: [size, size],
                html: '<span>' + count + '</span>',
            });
        },
        scale: scaleLinear().domain([1, 100]).range([20, 40]).clamp(true),
    },

    initialize(opts) {
        const options = L.setOptions(this, opts);
        L.MarkerClusterGroup.prototype.initialize.call(this, options);

        if (options.data) {
            this.addData(options.data);
        } else {
            this.loadData(options.api + encodeURIComponent(L.Util.template(options.query, options)));
        }
    },

    // Load DHIS2 data
    loadData(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addData.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    // Add DHIS2 data
    addData(data) {
        const rows = data.rows;

        if (rows.length) { // Create markers from data
            this.addLayers(rows.map(d => {
                return L.circleMarker(JSON.parse(d.geom).coordinates.reverse(), {
                    id: d.uid,
                    radius: 6,
                    color: '#fff',
                    weight: 1,
                    fillColor: this.options.color,
                    opacity: this.options.opacity,
                    fillOpacity: this.options.opacity,
                });
            }));
        }
    },

    setOpacity(opacity) {
        this.options.opacity = opacity;

        // Set circle marker opacity
        this.eachLayer(layer => {
            layer.setStyle({
                opacity: opacity,
                fillOpacity: opacity,
            });
        });

        // Set cluster marker opacity
        this._featureGroup.eachLayer(layer => {
            if (layer.setOpacity) {
                layer.setOpacity(opacity);
            }
        });
    },

});

export default function clientCluster(options) {
    return new ClientCluster(options);
}
