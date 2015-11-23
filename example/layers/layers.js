import map from '../../src';
import '../../scss/dhis2-gis.scss';

map('map', {
    layers: [{
        type: 'mapQuest',
        name: 'OpenStreetMap',
        baseLayer: true,
        visible: true,
    }, {
        type: 'google',
        name: 'Google Streets',
        baseLayer: true,
        visible: false,
    }, {
        type: 'google',
        name: 'Google Terrain',
        style: 'TERRAIN',
        baseLayer: true,
        visible: false,
    }, {
        type: 'google',
        name: 'Google Satellite',
        style: 'SATELLITE',
        baseLayer: true,
        visible: false,
    }, {
        type: 'google',
        name: 'Google Hybrid',
        style: 'HYBRID',
        baseLayer: true,
        visible: false,
    }, {
        type: 'earthEngine',
        name: 'Elevation',
        overlay: true,
        visible: false,
        mapId: '0f129e4e9edd5e503dc63bbef38fbcf7',
        opacity: 0.5,
    }, {
        type: 'choropleth',
        name: 'Choropleth',
        overlay: true,
        visible: true,
        features: '/data/geofeatures.json',
        data: '/data/analytics.json',
        popup(feature) {
            return 'Popup content for ' + feature.properties.na;
        },
    }, {
        type: 'cluster',
        name: 'Cluster',
        overlay: true,
        visible: false,
        data: '/data/sierraleone.json',
    }],
    bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
});


