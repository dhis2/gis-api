import L from 'leaflet';
import clusterIcon from './ClusterIcon';
import {scaleLinear} from 'd3-scale';
// import 'leaflet.markercluster';
import '../../temp/leaflet.markercluster-fix'; // TODO: Remove when cluster repo is compatible with Leaflet 1.0

export const ClientCluster = L.MarkerClusterGroup.extend({

    options: {
        maxClusterRadius: 60,
        showCoverageOnHover: false,
        iconCreateFunction(cluster) {
            const size = this.scale(cluster.getChildCount());
            return clusterIcon({
                color: this.color,
                iconSize: [size, size],
                html: '<span>' + cluster.getChildCount() + '</span>',
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
                    fillOpacity: this.options.opacity,
                });
            }));
        }
    },

});

export default function clientCluster(options) {
    return new ClientCluster(options);
}
