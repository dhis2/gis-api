import L from 'leaflet';
import {scaleLog} from 'd3-scale';
import clusterMarker from './ClusterMarker';

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
        this._maxZoomCount = {}; // Contains highest cluster count for each zoom level
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
        const tileId = this.getClusterTileId(coords);
        const options = this.options;

        if (this._clusterCache[tileId]) {
            this.addClusters(this._clusterCache[tileId]);
            return;
        }

        this._loadingTiles.push(tileId);

        const query = L.Util.template(options.query, {
            table: options.table,
            bounds: this._tileCoordsToBounds(coords).toBBoxString(),
            size: this.getResolution(coords.z) * options.clusterSize,
        });

        fetch(options.api + encodeURIComponent(query))
            .then(response => response.json())
            .then(data => this.onClusterTileLoad(tileId, data))
            .catch(ex => this.onClusterTileFail(tileId, ex));
    },

    onClusterTileLoad(tileId, data) {
        // Make sure that tile is still wanted
        const i = this._loadingTiles.indexOf(tileId);
        if (i !== -1) {
            this._loadingTiles.splice(i, 1);
            this.addClusters(data.rows);
        }
    },

    onClusterTileFail(tileId, ex) {
        window.console.log('parsing failed', ex);
    },

    onClusterClick(evt) {
        const marker = evt.layer;
        const bounds = marker.options.bounds;
        const map = this._map;

        if (bounds) { // Is cluster
            if (map.getZoom() !== map.getMaxZoom()) {
                this._map.fitBounds(bounds);
            } else {
                if (marker.options.ids) {
                    marker.bindPopup('IDs: ' + marker.options.ids.join()).openPopup();
                }
            }
        } else { // Is single marker
            marker.bindPopup('ID: ' + marker.options.id).openPopup();
        }
    },

    getClusterTileId(coords) {
        return `z${coords.z}x${coords.x}y${coords.y}`;
    },

    getClusterBounds(d) {
        const bounds = d.bounds.match(/([-\d\.]+)/g);
        return [[bounds[1], bounds[0]], [bounds[3], bounds[2]]];
    },

    addClusters(clusters) {
        clusters.forEach(d => {
            this._clusters.addLayer(this.createCluster(d));
        });
    },

    createCluster(d) {
        const latlng = d.center.match(/([-\d\.]+)/g).reverse();
        const options = this.options;
        const count = d.count;
        const zoom = this._map.getZoom();
        let marker;

        if (count === 1) {
            marker = L.circleMarker(latlng, {
                id: d.ids[0],
                radius: 6,
                color: '#fff',
                weight: 1,
                fillColor: options.color,
                fillOpacity: options.opacity,
                opacity: options.opacity,
            });
        } else {
            marker = clusterMarker(latlng, {
                size: this._scale(count),
                color: options.color,
                opacity: options.opacity,
                bounds: this.getClusterBounds(d),
                count: count,
                ids: d.ids,
            });

            if (this._maxZoomCount[zoom] === undefined) {
                this._maxZoomCount[zoom] = 0;
            }

            if (count > this._maxZoomCount[zoom]) {
                this._maxZoomCount[zoom] = count;
            }
        }

        return marker;
    },

    onZoomStart() {
        this._clusters.clearLayers();
        this._maxClusterCount = 0;
        this._loadingTiles = [];
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

});

export default function serverCluster(options) {
    return new ServerCluster(options);
}
