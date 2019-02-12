// Dot density map - event layer
import { GeoJson } from './GeoJson';
import circleMarker from './CircleMarker';
import { FeatureGroup } from './FeatureGroup';
import { Circles } from './Circles';

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

export const DotsGroup = FeatureGroup.extend({
    initialize(options = {}) {
        FeatureGroup.prototype.initialize.call(this, null, options);

        const { buffer, bufferStyle, data, pane } = options;

        if (buffer) {
            this.addLayer(new Circles({
                pane: `${pane}-buffer`,
                radius: buffer,
                style: bufferStyle,
                data,
            }));
        }

        this.addLayer(new Dots(options));
    },

});

export default function dots(options) {
    return new DotsGroup(options);
}
