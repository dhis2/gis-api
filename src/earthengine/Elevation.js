import {EarthEngine} from './EarthEngine';

export const Elevation = EarthEngine.extend({

    options: {
        id: 'USGS/SRTMGL1_003',
        name: 'Elevation',
        elevation: 500,
        config: {
            min: 0,
            max: 1000,
            palette: '#a50026,#d73027,#f46d43,#fdae61,#fee08b,#ffffbf,#d9ef8b,#a6d96a,#66bd63,#1a9850,#006837'
        },
        unit: 'm',
        description: 'Metres above sea level.',
        attribution: '<a href="https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003">NASA / USGS / JPL-Caltech</a>'
    },

    createImage() {
        const options = this.options;
        const eeImage = ee.Image(options.id);

        this.addImage(eeImage, options.config);

        if (options.elevation) {
            const contour = eeImage.resample('bicubic')
                .convolve(ee.Kernel.gaussian(5, 3))
                .subtract(ee.Image.constant(options.elevation)).zeroCrossing()
                .multiply(ee.Image.constant(options.elevation)).toFloat();

            this.addImage(contour.updateMask(contour), {palette:'000000'});
        }
    },

});

export default function elevation(options) {
    return new Elevation(options);
}
