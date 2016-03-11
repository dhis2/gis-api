import L from 'leaflet';
import {scaleLinear} from 'd3-scale';
import clusterMarker from './ClusterMarker';

export const ServerCluster = L.GridLayer.extend({
    options: {
        tileSize: 512,
        clusterSize: 110,
        color: 'red',
        opacity: 1,
        domain: [2, 100],
        range: [20, 40],
        zoomToFirstBounds: true,
    },

    initialize(opts) {
        const options = L.setOptions(this, opts);
        this._clusters = L.featureGroup();
        this._clusterCache = {};
        this._scale = scaleLinear().domain(options.domain).range(options.range).clamp(true);
        this._clusters.on('click', this.onClusterClick, this);
        this._maxZoomCount = {}; // Contains highest cluster count for each zoom level
        this._loadingTiles = []; // Contains cluster ids still loading
    },

    onAdd(map) {
        L.GridLayer.prototype.onAdd.call(this);
        this._clusters.addTo(map);
        map.on('zoomstart', this.onZoomStart, this);
    },

    createTile(coords) {
        const div = L.DomUtil.create('div', 'leaflet-tile-cluster');
        this.loadClusterTile(coords);
        return div;
    },

    loadClusterTile(coords) {
        const tileId = this.getClusterTileId(coords);

        if (this._clusterCache[tileId]) {
            this.addClusters(this._clusterCache[tileId]);
            return;
        }

        this._loadingTiles.push(tileId);

        const tileBounds = this._tileCoordsToBounds(coords).toBBoxString();
        const clusterSize = this.getResolution(coords.z) * this.options.clusterSize;
        // const query = `SELECT COUNT(the_geom) AS count, CASE WHEN COUNT(the_geom) <= 20 THEN array_agg(cartodb_id) END AS ids, ST_AsText(ST_Centroid(ST_Collect(the_geom))) AS center, ST_Extent(the_geom) AS bounds FROM spot WHERE (the_geom && ST_MakeEnvelope(${tileBounds}, 4326)) GROUP BY ST_SnapToGrid(ST_Transform(the_geom, 3785), ${clusterSize})`;
        // const query = `SELECT COUNT(uid) AS count, CASE WHEN COUNT(uid) <= 20 THEN array_agg(uid) END AS ids, ST_AsText(ST_Centroid(ST_Collect(the_geom))) AS center, ST_Extent(the_geom) AS bounds FROM (SELECT uid, ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) AS the_geom FROM programstageinstance) sq WHERE the_geom && ST_MakeEnvelope(${tileBounds}, 4326) GROUP BY ST_SnapToGrid(ST_Transform(the_geom, 3785), ${clusterSize})`;
        const query = `SELECT COUNT(uid) AS count, CASE WHEN COUNT(uid) <= 20 THEN array_agg(uid) END AS ids, ST_AsText(ST_Centroid(ST_Collect(the_geom))) AS center, ST_Extent(the_geom) AS bounds FROM (SELECT cartodb_id AS uid, the_geom FROM programstageinstance_random) sq WHERE the_geom && ST_MakeEnvelope(${tileBounds}, 4326) GROUP BY ST_SnapToGrid(ST_Transform(the_geom, 3785), ${clusterSize})`;

        fetch(`http://dhis2.cartodb.com/api/v2/sql?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => this.onClusterTileLoad(tileId, data))
            .catch(ex => this.onClusterTileLoad(tileId, ex));
    },

    onClusterTileLoad(tileId, data) {
        if (data.rows.length) {
            this.addClusters(data.rows);
        }
        this.scaleClusters(tileId);
    },

    onClusterTileFail(tileId, ex) {
        window.console.log('parsing failed', ex);
        this.scaleClusters(tileId);
    },

    onClusterClick(evt) {
        const marker = evt.layer;
        const bounds = marker.options.bounds;
        const map = this._map;

        // console.log(this._map.getZoom(), this._map.getMaxZoom());

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

    scaleClusters(tileId) {
        const i = this._loadingTiles.indexOf(tileId);
        if (i !== -1) {
            this._loadingTiles.splice(i, 1);
        }

        if (!this._loadingTiles.length) {
            const maxCount = this._maxZoomCount[this._map.getZoom()];
            const scale = scaleLinear().domain([1, maxCount]).range(this.options.range).clamp(true);

            this._clusters.eachLayer(layer => {
                if (layer.setSize) { // cluster marker
                    layer.setSize(scale(layer.options.count), layer.options.count);
                }
            });
        }
    },

    onZoomStart() {
        this._clusters.clearLayers();
        this._maxClusterCount = 0;
        this._loadingTiles = [];
    },

    // Meters per pixel
    // http://blog.thematicmapping.org/2012/09/creating-shaded-relief-map-of-new.html
    // http://blog.thematicmapping.org/2012/07/using-custom-projections-with-tilecache.html
    getResolution(zoom) {
        return (Math.PI * L.Projection.SphericalMercator.R * 2 / 256) / Math.pow(2, zoom);
    },

    setOpacity(opacity) {
        this._clusters.eachLayer(layer => {
            if (layer.setOpacity) { // cluster marker
                layer.setOpacity(opacity);
            } else {
                layer.setStyle({ // circle marker
                    fillOpacity: opacity,
                });
            }
        });
    },

});

export default function serverCluster(options) {
    return new ServerCluster(options);
}
