import L from 'leaflet';
import layerMixin from './layerMixin';

export const FeatureGroup = L.FeatureGroup.extend({
    ...layerMixin,

    createPane(map) {
        this.eachLayer(layer => layer.createPane(map));
    },

    setIndex(index) {
        const zIndex = 200 + (index * 10);

        this.getLayers().forEach((layer, i) => {
            layer.getPane().style.zIndex = zIndex + i;
        });
    },

    setOpacity(opacity) {
        this.eachLayer(layer => layer.setOpacity(opacity));
    },
});

export default FeatureGroup;
