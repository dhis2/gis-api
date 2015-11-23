import map from '../../src';
import '../../scss/dhis2-gis.scss';

map('map', {
    layers: [{
        type: 'mapQuest',
        name: 'OpenStreetMap',
    }, {
        type: 'cluster',
        data: '/data/sierraleone.json',
    }],
    bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
});
