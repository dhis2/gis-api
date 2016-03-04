import map from '../../src';

map('map', {
    layers: [{
        type: 'mapQuest',
        name: 'OpenStreetMap',
        baseLayer: true,
    }, {
        type: 'geoServer',
        name: 'Events',
        url: 'http://localhost:8090/geoserver/dhis2/wms?',
        layers: 'dhis2:programstageinstance',
        styles: 'event',
        overlay: true,
    }],
    bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
});
