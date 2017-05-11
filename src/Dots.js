// Dot density map - event layer
import { GeoJson } from './GeoJson';
import circleMarker from './CircleMarker';

// Layer of circle markers
export const Dots = GeoJson.extend({

    initialize(options = {}) {
        if (!options.pointToLayer) {
            options.pointToLayer = this.pointToLayer.bind(this);
        }

        GeoJson.prototype.initialize.call(this, options);

        this.on('click', this.onMarkerClick, this);
    },

    onMarkerClick(evt) {
        evt.layer.showPopup();
    },

    pointToLayer(feature) {
        return circleMarker(feature, this.options);
    },

});

export default function dots(options) {
    return new Dots(options);
}
