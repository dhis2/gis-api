import { GeoJson } from './GeoJson';
import { FeatureGroup } from './FeatureGroup';

// Events and Tracked Entities layer
export const Events = GeoJson.extend({
    addLayer(layer) {
        const { geometry, properties } = layer.feature;

        if (geometry.type !== 'Point' && properties.color) {
            layer.setStyle({
                color: properties.color,
            });
            // console.log('#', geometry, properties, this.options);
        }

        GeoJson.prototype.addLayer.call(this, layer);
    },
});

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
