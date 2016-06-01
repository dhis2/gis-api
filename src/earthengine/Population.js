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
        let eeImage;
        let collection = ee.ImageCollection(options.id); // eslint-disable-line

        for (const filter of options.filter) {
            collection = collection.filter(ee.Filter[filter.type].apply(this, filter.arguments));  // eslint-disable-line
            eeImage = collection.mosaic();
        }

        this.addImage(eeImage, options.config);
    },

});

export default function population(options) {
    return new Population(options);
}
