import L from 'leaflet';
import layerMixin from './layerMixin';

export const FeatureGroup = L.FeatureGroup.extend({
    ...layerMixin,

    createPane(map) {
        this.invoke('createPane', map);
    },

    setIndex(index) {
        const zIndex = 200 + (index * 10);

        this.getLayers().forEach((layer, i) => {
            layer.getPane().style.zIndex = zIndex + i;
        });

        this.options.index = index;
    },

    setOpacity(opacity) {
        this.invoke('setOpacity', opacity);
    },

    setVisibility(isVisible) {
        this.invoke('setVisibility', isVisible);
    },
});

export default FeatureGroup;
