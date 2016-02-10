import map from '../../src';

map('map', {
    layers: [{
        type: 'mapQuest',
    }, {
        type: 'earthEngine',
        mapId: '0f129e4e9edd5e503dc63bbef38fbcf7',
        opacity: 0.5,
    }],
    bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
});
