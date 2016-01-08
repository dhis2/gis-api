import {GeoJson} from './GeoJson';

export const Choropleth = GeoJson.extend({

    options: {
        style: {
            color: '#FFF',
            weight: 1,
            fillOpacity: 0.8,
        },
        highlightStyle: {
            weight: 2,
        },
        valueKey: 'value',
        colorKey: 'color',
    },

    addLayer(layer) {
        const color = layer.feature.properties[this.options.colorKey];

        if (color) {
            layer.setStyle({
                fillColor: color,
            });
        }

        GeoJson.prototype.addLayer.call(this, layer);
    },

});

export default function choropleth(options) {
    return new Choropleth(options);
}
