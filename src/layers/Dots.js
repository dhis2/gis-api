import { GeoJson } from './GeoJson';
import circleMarker from './CircleMarker';
import { FeatureGroup } from './FeatureGroup';

// Layer of circle markers
export const Dots = GeoJson.extend({
    initialize(options = {}) {
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

// Dots layer with buffers
export const DotsGroup = FeatureGroup.extend({
    initialize(options) {
        FeatureGroup.prototype.initialize.call(this, options);
        this.addBuffers();
        this.addLayer(new Dots(options));
    },
});

export default function dots(options) {
    return new DotsGroup(options);
}
