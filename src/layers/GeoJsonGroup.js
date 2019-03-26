import { FeatureGroup } from './FeatureGroup';
import { GeoJson } from './GeoJson';

// GeoJSON layer with labels and buffers
export const GeoJsonGroup = FeatureGroup.extend({
    initialize(options) {
        FeatureGroup.prototype.initialize.call(this, options);

        this.addBuffers();
        this.addLayer(new GeoJson(options));
        this.addLabels();
    },
});

export default function geoJsonGroup(options) {
    return new GeoJsonGroup(options);
}