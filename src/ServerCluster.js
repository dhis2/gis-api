import L from 'leaflet';
import '../temp/leaflet.markercluster-fix'; // TODO: Remove when cluster repo is compatible with Leaflet 1.0

export const ServerCluster = L.GridLayer.extend({
    options: {
        tileSize: 512,
        clusterSize: 110,
    },

    initialize(options) {
        L.setOptions(this, options);
        this._clusters = L.featureGroup();
        this._clusterCache = {};

        // Used to replicate spiderify from Leaflet.markercluster
        // this._markerCluster = new L.MarkerCluster();
        // this._markerCluster._group = new L.MarkerClusterGroup();

        this._clusters.on('click', this.onClusterClick, this);
    },

    onAdd(map) {
        L.GridLayer.prototype.onAdd.call(this);

        this._clusters.addTo(map);

        // this._markerCluster._group._map = map;

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

        const tileBounds = this._tileCoordsToBounds(coords).toBBoxString();
        const clusterSize = this.getResolution(coords.z) * this.options.clusterSize;
        const query = `SELECT COUNT(the_geom) AS count, CASE WHEN COUNT(the_geom) <= 20 THEN array_agg(cartodb_id) END AS ids, ST_AsText(ST_Centroid(ST_Collect(the_geom))) AS center, ST_Extent(the_geom) AS bounds FROM spot WHERE (the_geom && ST_MakeEnvelope(${tileBounds}, 4326)) GROUP BY ST_SnapToGrid(ST_Transform(the_geom, 3785), ${clusterSize})`;

        fetch(`http://turban.cartodb.com/api/v2/sql?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => this.onClusterTileLoad(tileId, data))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    onClusterTileLoad(tileId, data) {
        this._clusterCache[tileId] = data.rows;

        if (data.rows.length) {
            this.addClusters(data.rows);
        }
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
                // this.spiderifyCluster(evt.layer);
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
        const bounds = d.bounds.match(/([\d\.]+)/g);
        return [[bounds[1], bounds[0]], [bounds[3], bounds[2]]];
    },

    addClusters(clusters) {
        clusters.forEach(d => {
            this._clusters.addLayer(this.createCluster(d));
        });
    },

    createCluster(d) {
        const latlng = d.center.match(/([\d\.]+)/g).reverse();

        if (d.count === 1) {
            return L.marker(latlng, {
                id: d.ids[0],
            });
        }

        let c = ' marker-cluster-';
        if (d.count < 10) {
            c += 'small';
        } else if (d.count < 100) {
            c += 'medium';
        } else {
            c += 'large';
        }

        return L.marker(latlng, {
            icon: L.divIcon({
                html: `<div><span>${d.count}</span></div>`,
                className: `marker-cluster${c}`,
                iconSize: [40, 40],
            }),
            bounds: this.getClusterBounds(d),
            count: d.count,
            ids: d.ids,
        });
    },

    spiderifyCluster(cluster) {
        const map = this._map;
        const center = map.latLngToLayerPoint(cluster._latlng);
        const positions = this._markerCluster._generatePointsSpiral(cluster.options.count, center);
        const ids = cluster.options.ids;
        const childMarkers = [];

        this._markerCluster._latlng = cluster._latlng;

        for (let i = 0; i < ids.length; i++) {
            const marker = L.marker(cluster._latlng).addTo(map);
            childMarkers.push(marker);
        }

        this._markerCluster._animationSpiderfy(childMarkers, positions);
    },

    onZoomStart() {
        this._clusters.clearLayers();
    },

    // Meters per pixel
    // http://blog.thematicmapping.org/2012/09/creating-shaded-relief-map-of-new.html
    // http://blog.thematicmapping.org/2012/07/using-custom-projections-with-tilecache.html
    getResolution(zoom) {
        return (Math.PI * L.Projection.SphericalMercator.R * 2 / 256) / Math.pow(2, zoom);
    },

});

export default function serverCluster(options) {
    return new ServerCluster(options);
}
