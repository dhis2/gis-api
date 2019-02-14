import map from '../../src';

map('map', {
    layers: [{
        type: 'mapQuest',
    }, {
        type: 'choropleth',
        features: '/data/districts-features.json',
        data: '/data/districts-data.json',
        popup(feature) {
            return 'Popup content for ' + feature.properties.na;
        },
    }],
    bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
});
