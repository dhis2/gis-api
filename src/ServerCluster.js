import L from 'leaflet';

export const ServerCluster = L.GridLayer.extend({
    options: {
        tileSize: 512,
        clusterSize: 100,
    },

    initialize(options) {
        L.setOptions(this, options);
        // this._clusters = L.featureGroup();
        this._clusters = L.layerGroup();
    },

    onAdd(map) {
        L.GridLayer.prototype.onAdd.call(this);
        this._clusters.addTo(map);

        // this._clusters.addLayer(L.marker([59.337414, 5.968329]));
        map.on('zoomstart', this.onZoomStart, this);
    },

    createTile(coords) {
        const div = L.DomUtil.create('div', 'leaflet-tile-cluster');
        // div.innerHTML = 'Bounds:<br>' + tileBounds.toBBoxString().replace(/\,/g, ',<br>');
        // console.log("create tile", this.getClusterTileId(coords), tileBounds.toBBoxString());

        this.loadClusterTile(coords);
        return div;
    },

    loadClusterTile(coords) {
        const tileId = this.getClusterTileId(coords);
        const tileBounds = this._tileCoordsToBounds(coords).toBBoxString();
        const clusterSize = this.getResolution(coords.z) * this.options.clusterSize;
        const query = `SELECT COUNT(the_geom) AS count, ST_AsText(ST_Centroid(ST_Collect(the_geom))) AS center FROM spot WHERE (the_geom && ST_MakeEnvelope(${tileBounds}, 4326)) GROUP BY ST_SnapToGrid(ST_Transform(the_geom, 3785), ${clusterSize})`;


        // const scale = 1 / (234.375 / Math.pow(2, zoom));
        // return 1 / (234.375 / Math.pow(2, zoom));

        // console.log('load', tileId, clusterSize);

        fetch(`http://turban.cartodb.com/api/v2/sql?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => this.onClusterTileLoad(tileId, data))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    onClusterTileLoad(tileId, data) {
        if (data.rows.length) {
            this.addClusters(data.rows);
        }
    },

    getClusterTileId(coords) {
        return `z${coords.z}x${coords.x}y${coords.y}`;
    },

    addClusters(clusters) {
        clusters.forEach(d => {
            this._clusters.addLayer(this.createCluster(d));
        });
    },

    createCluster(d) {
        const latlng = d.center.match(/([\d\.]+)/g).reverse();

        if (d.count === 1) {
            return L.marker(latlng);
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
        });
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
