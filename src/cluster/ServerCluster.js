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
        this._loadingTiles = []; // Contains cluster ids still loading
        this._spiderLegs = L.featureGroup();
        this._spiderMarkers = L.featureGroup();
    },

    onAdd(map) {
        L.GridLayer.prototype.onAdd.call(this);

        if (!map.hasLayer(this._clusters)) {
            this._clusters.addTo(map);
        }

        this._spiderLegs.addTo(map);
        this._spiderMarkers.addTo(map);

        map.on('zoomstart', this.onZoomStart, this);
        map.on('mousedown', this.unspiderify, this);
    },

    onRemove(map) {
        this._clusters.clearLayers();
        map.removeLayer(this._clusters);
        map.off('zoomstart', this.onZoomStart, this);
        map.off('mousedown', this.unspiderify, this);
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
            } else if (marker.options.ids) {
                this.spiderify(marker);
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
        }

        return marker;
    },

    onZoomStart() {
        this._clusters.clearLayers();
        this._loadingTiles = [];
        this.unspiderify();
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

    spiderify(cluster) {
        const options = this.options;
        const map = this._map;
        const latlng = cluster.getLatLng();
        const center = map.latLngToLayerPoint(latlng);
        const ids = cluster.options.ids || []; // TODO: Add name?
        const count = ids.length; // cluster.options.length
        const legOptions = { weight: 1.5, color: '#222', opacity: 0.5 };
        const _2PI = Math.PI * 2;
        const circumference = 13 * (2 + count);
        const startAngle = Math.PI / 6;
        const legLength = circumference / _2PI;
        const angleStep = _2PI / count;

        this.unspiderify();

        for (let i = count - 1, angle, point, uid, newPos; i >= 0; i--) {
            angle = startAngle + i * angleStep;
            point = L.point(center.x + legLength * Math.cos(angle), center.y + legLength * Math.sin(angle))._round();
            uid = ids[i];
            newPos = map.layerPointToLatLng(point);

            this._spiderLegs.addLayer(L.polyline([latlng, newPos], legOptions));

            this._spiderMarkers.addLayer(L.circleMarker(newPos, {
                id: uid,
                radius: 6,
                color: '#fff',
                weight: 1,
                fillColor: options.color,
                fillOpacity: options.opacity,
                opacity: options.opacity,
            }));
        }

        cluster.setOpacity(0.1);
        this._spiderCluster = cluster;
    },

    unspiderify() {
        if (this._spiderCluster) {
            this._spiderCluster.setOpacity(this.options.opacity);
            this._spiderLegs.clearLayers();
            this._spiderMarkers.clearLayers();
            this._spiderCluster = null;
        }
    },

});

export default function serverCluster(options) {
    return new ServerCluster(options);
}
