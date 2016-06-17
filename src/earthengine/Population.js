import {EarthEngine} from './EarthEngine';

export const Population = EarthEngine.extend({

    options: {
        id: 'WorldPop/POP',
        name: 'Population density 2010',
        filter: [{
            type: 'eq',
            arguments: ['year', 2010]
        },{
            type: 'eq',
            arguments: ['UNadj', 'yes']
        }],
        description: 'Population in 100 x 100 m grid cells.',
        attribution: '<a href="https://explorer.earthengine.google.com/#detail/WorldPop%2FPOP">WorldPop</a>'
    },

    createImage() {
        const options = this.options;
        const legend = this._legend;
        let eeImage;
        let collection = ee.ImageCollection(options.id); // eslint-disable-line
        let zones;

        for (const filter of options.filter) {
            collection = collection.filter(ee.Filter[filter.type].apply(this, filter.arguments));  // eslint-disable-line
            eeImage = collection.mosaic();
        }

        eeImage = eeImage.updateMask(eeImage.gt(0)); // Mask out 0-values

        for (let i = 0, item; i < legend.length - 1; i++) {
            item = legend[i];
            if (!zones) {
                zones = eeImage.gt(item.to);
            } else {
                zones = zones.add(eeImage.gt(item.to));
            }
        }

        const eeImageRGB = zones.visualize({
            min: 0,
            max: legend.length - 1,
            palette: options.params.palette
        });

        this.addLayer(eeImageRGB);
    },

    // TODO: Use method in EarthEngine.js
    getLegend() {
        const options = this.options;
        let legend = '<div class="dhis2-legend"><h2>' + options.name + '</h2>';

        if (options.description) {
            legend += '<p>' +  options.description + '</p>';
        }

        legend += '<dl>';

        for (let i = 0, item; i < this._legend.length; i++) {
            item = this._legend[i];
            legend += '<dt style="background-color:' + item.color + ';box-shadow:1px 1px 2px #aaa;"></dt>';
            legend += '<dd>' + item.name + ' ' + (options.unit || '') + '</dd>';
        }

        legend += '</dl>';

        if (options.attribution) {
            legend += '<p>Data: ' + options.attribution + '</p>';
        }

        legend += '<div>';

        return legend;
    },

});

export default function population(options) {
    return new Population(options);
}
