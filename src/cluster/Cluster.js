// Support both client and server clustering
import L from 'leaflet';
import clientCluster from './ClientCluster';
import serverCluster from './ServerCluster';

export const Cluster = L.Layer.extend({
    options: {
        clientClusterLimit: 2000,
        fitBounds: true,
        color: 'red',
        opacity: 1,
    },

    initialize(options) {
        L.setOptions(this, options);
    },

    onAdd(map) {
        this._map = map;
        if (!this._clusterLayer) {
            this.initCluster();
        }
    },

    initCluster() {
        const query = L.Util.template(this.options.query, this.options);

        fetch(this.options.api + encodeURIComponent(query))
            .then(response => response.json())
            .then(data => this.onInitLoad(data.rows[0]))
            .catch(ex => {
                window.console.log('parsing failed', ex); // TODO
            });
    },

    onInitLoad(data) {
        if (this.options.fitBounds) {
            this._map.fitBounds(this._boxToBounds(data.extent));
        }

        if (data.count <= this.options.clientClusterLimit) {
            this.initClientCluster();
        } else {
            this.initServerCluster();
        }
    },

    initClientCluster() {
        this._clusterLayer = clientCluster(L.extend(this.options, {
            query: 'SELECT uid, ST_AsGeoJSON(the_geom) AS geom FROM {table}',
        })).addTo(this._map);
    },

    initServerCluster() {
        this._clusterLayer = serverCluster().addTo(this._map);
    },

    // Converts a PostGIS box2d to Leaflet bounds
    _boxToBounds(box) {
        const coords = box.match(/[0-9\.\-]+/g);
        return [[coords[1], coords[0]], [coords[3], coords[2]]];
    },

});

export default function cluster(options) {
    return new Cluster(options);
}

