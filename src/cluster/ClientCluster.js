import L from 'leaflet';
import clusterIcon from './ClusterIcon';
import {scaleLog} from 'd3-scale';
import '../../temp/leaflet.markercluster-src'; // TODO: Remove when cluster repo is compatible with Leaflet 1.0

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
                count: count,
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
        } else {
            this.loadData(options.api + encodeURIComponent(L.Util.template(options.query, options)));
        }

        this.on('mouse', this._onClick, this);
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
        const options = this.options;

        if (data.length) {
            options.domain = [1, data.length];
            options.scale = scaleLog().domain(options.domain).range(options.range).clamp(true);

            this.addLayers(data.map(d => {
                const marker = L.circleMarker(d.geometry.coordinates.reverse(), {
                    id: d.id,
                    radius: options.radius,
                    fillColor: options.color,
                    opacity: options.opacity,
                    fillOpacity: options.opacity,
                    color: '#fff',
                    weight: 1,
                });

                if (options.popup) {
                    this.bindPopup(L.Util.template(options.popup, d.properties));
                }

                return marker;
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
