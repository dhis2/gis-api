import L from 'leaflet';
import {scaleLog} from 'd3-scale';
import clusterMarker from './ClusterMarker';
import circleMarker from '../CircleMarker';

export const ServerCluster = L.GridLayer.extend({
    options: {
        tileSize: 512,
        clusterSize: 110,
        color: 'red',
        opacity: 1,
        domain: [1, 10000],
        range: [16, 40],
        zoomToFirstBounds: true,
    },

    initialize(opts) {
        const options = L.setOptions(this, opts);
        this._clusters = L.featureGroup();
        this._clusterCache = {};
        this._scale = scaleLog().base(Math.E).domain(options.domain).range(options.range).clamp(true);
        this._clusters.on('click', this.onClusterClick, this);
        this._loadingTiles = []; // Contains cluster ids still loading
    },

    onAdd(map) {
        L.GridLayer.prototype.onAdd.call(this);

        if (!map.hasLayer(this._clusters)) {
            this._clusters.addTo(map);
        }

        map.on('zoomstart', this.onZoomStart, this);
    },

    onRemove(map) {
        this._clusters.clearLayers();
        map.removeLayer(this._clusters);
        map.off('zoomstart', this.onZoomStart, this);
    },

    createTile(coords) {
        const div = L.DomUtil.create('div', 'leaflet-tile-cluster');
        this.loadClusterTile(coords);
        return div;
    },

    loadClusterTile(coords) {
        const tileId = this._tileCoordsToKey(coords);

        const options = this.options;
        const map = this._map;

        if (this._clusterCache[tileId]) {
            this.addClusters(tileId, this._clusterCache[tileId]);
            return;
        }

        this._loadingTiles.push(tileId);

        const params = {
            tileId: tileId,
            bbox: this._tileCoordsToBounds(coords).toBBoxString(),
            clusterSize: Math.round(this.getResolution(coords.z) * options.clusterSize),
            includeClusterPoints: (map.getZoom() === map.getMaxZoom()),
        };

        if (options.load) {
            options.load(params, L.bind(this.onClusterTileLoad, this), this);
        }
    },

    onClusterTileLoad(tileId, features) {
        const i = this._loadingTiles.indexOf(tileId);
        if (i !== -1) {
            this._loadingTiles.splice(i, 1);
            this.addClusters(tileId, features);
        }
    },

    onClusterClick(evt) {
        const marker = evt.layer;
        const map = this._map;

        if (marker.getBounds) { // Is cluster
            if (map.getZoom() !== map.getMaxZoom()) { // Zoom to cluster bounds
                map.fitBounds(marker.getBounds());
            } else { // Spiderify on last zoom
                if (this._spider) {
                    this._spider.unspiderify();
                }
                this._spider = marker.spiderify();
            }
        } else if (this.options.popup) { // Is single marker
            marker.showPopup();
        }
    },

    getClusterBounds(box) {
        const bounds = box.match(/([-\d\.]+)/g);
        return [[bounds[1], bounds[0]], [bounds[3], bounds[2]]];
    },

    addClusters(tileId, clusters) {
        clusters.forEach(d => {
            this._clusters.addLayer(this.createCluster(d));
        });

        this._clusterCache[tileId] = clusters;
    },

    createCluster(feature) {
        let marker;

        if (feature.properties.count === 1) {
            marker = circleMarker(feature, this.options);
        } else {
            feature.properties.size = this._scale(feature.properties.count);
            marker = clusterMarker(feature, this.options);
        }

        return marker;
    },

    onZoomStart() {
        this._clusters.clearLayers();
        this._loadingTiles = [];

        if (this._spider) {
            this._spider.unspiderify();
        }
    },

    // Meters per pixel
    getResolution(zoom) {
        return (Math.PI * L.Projection.SphericalMercator.R * 2 / 256) / Math.pow(2, zoom);
    },

    setOpacity(opacity) {
        this.options.opacity = opacity;

        this._clusters.eachLayer(layer => {
            if (layer.setOpacity) { // cluster marker
                layer.setOpacity(opacity);
            } else {
                layer.setStyle({ // circle marker
                    opacity: opacity,
                    fillOpacity: opacity,
                });
            }
        });
    },

    _removeTile(key) {
        const clusters = this._clusterCache[key];

        if (clusters) {
            clusters.forEach(d => {
                this._clusters.removeLayer(d);
            });
        }

        L.GridLayer.prototype._removeTile.call(this, key);
    },

});

export default function serverCluster(options) {
    return new ServerCluster(options);
}
