import { GeoJson } from './GeoJson';
import { FeatureGroup } from './FeatureGroup';

// Events and Tracked Entities layer
export const Events = GeoJson.extend({});

// Choropleth layer with labels
export const EventsGroup = FeatureGroup.extend({
    initialize(options) {
        FeatureGroup.prototype.initialize.call(this, options);

        this.addBuffers();
        this.addLayer(new Events(options));
    },
});

export default function events(options) {
    return new EventsGroup(options);
}
