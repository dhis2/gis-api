import {EarthEngine} from './EarthEngine';
import {scaleLinear} from 'd3-scale';

export const Elevation = EarthEngine.extend({

    options: {
        id: 'USGS/SRTMGL1_003',
        name: 'Elevation',
        unit: 'm',
        description: 'Metres above sea level.',
        attribution: '<a href="https://explorer.earthengine.google.com/#detail/USGS%2FSRTMGL1_003">NASA / USGS / JPL-Caltech</a>'
    },

    createImage() {
        const options = this.options;
        const params = options.params;
        const legend = this._legend;

        let eeImage = ee.Image(options.id);
        let zones;

        eeImage = eeImage.updateMask(eeImage.gt(0)); // Mask out sea

        for (let i = 0, item; i < legend.length - 1; i++) {
            item = legend[i];
            if (!zones) {
                zones = eeImage.gt(item.to);
            } else {
                zones = zones.add(eeImage.gt(item.to));
            }
        }

        // eeImage = eeImage.select(['elevation']);
        //var eeImageMasked = eeImage.updateMask(eeImage.gt(options.params.min).and(eeImage.lt(options.params.max)));
        //const eeImageRGB = eeImageMasked.visualize(options.params);

        //const eeImageRGB = eeImage.visualize(options.params);
        const eeImageRGB = zones.visualize({
            min: 0,
            max: legend.length - 1,
            palette: params.palette
        });


        /*
        if (options.elevation) {
            let contour = eeImage.resample('bicubic')
                .convolve(ee.Kernel.gaussian(5, 3))
                .subtract(ee.Image.constant(options.elevation)).zeroCrossing()
                .multiply(ee.Image.constant(options.elevation)).toFloat();

            contour = contour.updateMask(contour);

            const contourRGB = contour.visualize({palette:'000000'});

            this.addLayer(ee.ImageCollection([eeImageRGB, contourRGB]).mosaic());
        }
        */

        this.addLayer(eeImageRGB);
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

export default function elevation(options) {
    return new Elevation(options);
}
