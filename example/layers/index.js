import map from '../../src';

map('map', {
    layers: [{
        type: 'mapQuest',
        name: 'OpenStreetMap',
        baseLayer: true,
        visible: false,
    }, /* {
        type: 'tileLayer',
        url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        name: 'Light',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        baseLayer: true,
        visible: true,
    }, {
        type: 'googleLayer',
        name: 'Google Streets',
        baseLayer: true,
        visible: false,
    },  {
        type: 'googleLayer',
        name: 'Google Terrain',
        style: 'TERRAIN',
        baseLayer: true,
        visible: false,
    }, {
        type: 'googleLayer',
        name: 'Google Satellite',
        style: 'SATELLITE',
        baseLayer: true,
        visible: false,
    }, {
        type: 'googleLayer',
        name: 'Google Hybrid',
        style: 'HYBRID',
        baseLayer: true,
        visible: false,
    } {
        // https://code.earthengine.google.com/d09f38a4d065b54eea18d5fcc9189ad2
        type: 'earthEngine',
        name: 'Landcover',
        overlay: true,
        visible: false,
        mapId: 'bcdef31a55df98d51f0c9f9b76406b70',
        token: 'e4c55f500e1952bc68b6d6ea692224ef',
        opacity: 0.8,
    }, {
        // https://code.earthengine.google.com/d09f38a4d065b54eea18d5fcc9189ad2
        type: 'earthEngine',
        name: 'Elevation',
        overlay: true,
        visible: false,
        // mapId: '0f129e4e9edd5e503dc63bbef38fbcf7',
        // token: 'bb1bda722c87c56c2420669af1ddebff',
        mapId: '73044e67e4abbd57d7ae4eb7ed37ca94',
        token: 'f53b1cdeb07ab5f21f5d196aa4d6a9e0',
        opacity: 0.8,
    }, {
        type: 'choropleth',
        name: 'Choropleth',
        overlay: true,
        visible: false,
        features: '/data/districts-features.json',
        data: '/data/districts-data.json',
        popup(feature) {
            return 'Popup content for ' + feature.properties.na;
        },
    }, */ {
        type: 'boundary',
        name: 'Districts',
        overlay: true,
        visible: false,
        features: '/data/districts-features.json',
        popup(feature) {
            return 'Popup content for ' + feature.properties.na;
        },
    },/* {
        type: 'features',
        name: 'Facilities',
        overlay: true,
        visible: false,
        features: '/data/facilities-features.json',
        popup(feature) {
            return 'Popup content for ' + feature.properties.na;
        },
    }, {
        type: 'heat',
        name: 'Heat',
        overlay: true,
        visible: false,
        data: '/data/facilities-features.json',
    }, {
        type: 'cluster',
        name: 'Cluster',
        overlay: true,
        visible: false,
        data: '/data/facilities-features.json',
    }, {
        type: 'grid',
        name: 'Grid',
        overlay: true,
        visible: false,
        data: '/data/facilities-features.json',
        bbox: [-13.3035, 6.9176, -10.2658, 10.0004],
        cellWidth: 20,
    }, {
        type: 'circleMarkers',
        name: 'Proportional symbols',
        overlay: true,
        visible: false,
        features: '/data/facilities-features.json',
        data: '/data/facilities-data.json',
        popup(feature) {
            return 'Popup content for ' + feature.properties.na;
        },
    }, {
        type: 'tileLayer',
        url: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
        name: 'Labels',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        overlay: true,
        visible: false,
    },*/
    ],
    bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
});
