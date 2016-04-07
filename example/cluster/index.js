import map from '../../srcx/';

map('map', {
    layers: [{
        type: 'mapQuest',
        name: 'OpenStreetMap',
    }, {
        type: 'cluster',
        name: 'Cluster',
        clustering: 'server',
        api: 'http://dhis2.cartodb.com/api/v2/sql?q=',
        query: 'SELECT count(*), ST_Extent(the_geom) AS extent FROM {table}',
        table: 'programstageinstance',
        // table: 'programstageinstance_random',
        overlay: true,
        visible: true,
        color: 'red',
        opacity: 1,
    }],
    bounds: [[-34.9, -18.7], [35.9, 50.2]],
    maxZoom: 10,
});
