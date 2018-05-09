// import L from 'leaflet';
import clusterIcon from './ClusterIcon';
import circleMarker from '../CircleMarker';
import {scaleLog} from 'd3-scale';
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster-src'; // Extends L above

export const ClientCluster = L.MarkerClusterGroup.extend({

    options: {
        maxClusterRadius: 40,
        showCoverageOnHover: false,
        iconCreateFunction(cluster) {
            const count = cluster.getChildCount();

            cluster.options.opacity = this.opacity;

            return clusterIcon({
                color: this.color,
                opacity: this.opacity,
                size: this.scale(count),
                count,
            });
        },
        domain: [1, 1000],
        range: [16, 40],
        radius: 6, // circle marker radius
    },

    initialize(opts) {
        const options = L.setOptions(this, opts);

        L.MarkerClusterGroup.prototype.initialize.call(this, options);

        if (options.data) {
            this.addData(options.data);
        }

        this.on('click', this.onMarkerClick, this);
    },

    onMarkerClick(evt) {
        evt.layer.showPopup();
    },

    addData(data) {
        const options = this.options;

        if (data.length) {
            options.domain = [1, data.length];
            options.scale = scaleLog().domain(options.domain).range(options.range).clamp(true);
            this.addLayers(data.map(d => circleMarker(d, options)));
        }
    },

    setOpacity(opacity) {
        this.options.opacity = opacity;
        this.eachLayer(layer => layer.setOpacity(opacity)); // Circle markers
        this._featureGroup.eachLayer(layer => layer.setOpacity(opacity)); // Cluster markers
    },

});

export default function clientCluster(options) {
    return new ClientCluster(options);
}
