import map from '../../src';

map('map', {
    layers: [{
        type: 'mapQuest',
    }, {
        type: 'earthEngine',
        id: 'WorldPop/POP/SLE_2014_UNadj',
        config: {
            min: 0,
            max: 250,
            palette: '#ffffd4, #fee391, #fec44f, #fe9929, #ec7014, #cc4c02, #8c2d04',
        },
        opacity: 0.5,
    }],
    bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
});
