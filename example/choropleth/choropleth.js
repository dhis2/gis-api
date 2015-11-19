import map from '../../src';
import '../../scss/dhis2-gis.scss';

map('map', {
    choropleth: {
        features: '/data/geofeatures.json',
        analytics: '/data/analytics.json',
    },
    bounds: [[6.9679, -13.29096], [9.9432, -10.4887]],
});
