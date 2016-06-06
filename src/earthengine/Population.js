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
        config: {
            min: 0,
            max: 100,
            palette: '#fffff0,#ffffd4,#fee391,#fec44f,#fe9929,#ec7014,#cc4c02,#b44200,#9a3800,#7f2f00,#642500'
        },
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
            palette: options.config.palette
        });

        this.addLayer(eeImageRGB);

        // this.addLayer(eeImage.visualize(options.config));
    },

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
