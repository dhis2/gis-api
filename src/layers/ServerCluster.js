import L from 'leaflet';
import { scaleLog } from 'd3-scale';
import clusterMarker from './ClusterMarker';
import circleMarker from './CircleMarker';

export const ServerCluster = L.GridLayer.extend({
    options: {
        pane: 'markerPane',
        tileSize: 512,
        clusterSize: 110,
        color: 'red',
        opacity: 1,
        domain: [1, 10000],
        range: [16, 40],
    },

    initialize(opts) {
        const options = L.setOptions(this, opts);
        this._clusters = L.featureGroup(); // Clusters shown on map
        this._tileClusters = {}; // Cluster cache
        this._scale = scaleLog()
            .base(Math.E)
            .domain(options.domain)
            .range(options.range)
            .clamp(true);
        this._clusters.on('click', this.onClusterClick, this);
        this._bounds = options.bounds;
    },

    onAdd(map) {
        this._levels = {};
        this._tiles = {};

        this._resetView();
        this._update();

        map.addLayer(this._clusters);

        map.on('zoomstart', this._onZoomStart, this);
    },

    onRemove(map) {
        this._clusters.clearLayers();
        map.removeLayer(this._clusters);
        map.off('zoomstart', this._onZoomStart, this);
    },

    // Load/add clusters within tile bounds
    createTile(coords) {
        const tileId = this._tileCoordsToKey(coords);
        const clusters = this._tileClusters[tileId];

        if (clusters) { // Add from cache
            clusters.forEach(cluster => this._clusters.addLayer(cluster));
            return;
        }

        const options = this.options;
        const map = this._map;
        const bounds = this._tileCoordsToBounds(coords);

        const params = {
            tileId,
            bbox: bounds.toBBoxString(),
            clusterSize: Math.round(this.getResolution(coords.z) * options.clusterSize),
            includeClusterPoints: (map.getZoom() === map.getMaxZoom()),
        };

        if (options.load && this._isWithinWorldBounds(bounds)) {
            options.load(params, L.bind(this.addClusters, this), this);
        }
    },

    _addTile(coords) {
        const key = this._tileCoordsToKey(coords);

        this._tiles[key] = {
            coords,
            current: true,
        };

        this.createTile(this._wrapCoords(coords));

        this.fire('tileloadstart', {
            key,
            coords,
        });
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

    // Add clusters for one tile
    addClusters(tileId, clusters) {
        const tileClusters = [];

        clusters.forEach((d) => {
            const cluster = this.createCluster(d);
            if (this._tiles[tileId]) { // If tile still present
                this._clusters.addLayer(cluster);
            }
            tileClusters.push(cluster);
        });

        this._tileClusters[tileId] = tileClusters;
    },

    // Create cluster or circle marker
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

    // Meters per pixel
    getResolution(zoom) {
        return ((Math.PI * L.Projection.SphericalMercator.R * 2) / 256) / Math.pow(2, zoom);
    },

    // Returns bounds for all clusters
    getBounds() {
        return this._bounds ? L.latLngBounds(this._bounds) : this._clusters.getBounds();
    },

    // Set opacity for all clusters and circle markers
    setOpacity(opacity) {
        const tileClusters = this._tileClusters;
        let tileId;
        let layer;

        for (tileId in tileClusters) { // eslint-disable-line
            if (tileClusters.hasOwnProperty(tileId)) {
                for (layer of tileClusters[tileId]) {
                    layer.setOpacity(opacity);
                }
            }
        }

        this.options.opacity = opacity;
    },

    // Remove clusters in tile
    _removeTile(key) {
        const tile = this._tiles[key];
        if (!tile) { return; }

        const clusters = this._tileClusters[key];

        if (clusters) {
            clusters.forEach(layer => this._clusters.removeLayer(layer));
        }

        delete this._tiles[key];

        this.fire('tileunload', {
            tileId: key,
            coords: this._keyToTileCoords(key),
        });
    },

    // Remove cluster on zoom change
    _onZoomStart() {
        this._clusters.clearLayers();
    },

    // Disable zoom animation
    _animateZoom() {},

    // We somtimes get cluster bounds outside valid range if requests are fired before the map dom el is properly sized
    _isWithinWorldBounds(bounds) {
        return bounds.getWest() >= -180 && bounds.getEast() <= 180 && bounds.getSouth() >= -90 && bounds.getNorth() <= 90;
    },

});

export default function serverCluster(options) {
    return new ServerCluster(options);
}
