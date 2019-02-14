import L from 'leaflet';
import 'leaflet-measure';

// Wrapper for the leaflet-measure control: https://github.com/ljagis/leaflet-measure
export const Measure = L.Control.Measure.extend({

    options: {
        position: 'topright',
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'miles',
        primaryAreaUnit: 'hectares',
        secondaryAreaUnit: 'acres',
        activeColor: '#ffa500',
        completedColor: '#ffa500',
    },

});

export default function measure(options) {
    return new Measure(options);
}
