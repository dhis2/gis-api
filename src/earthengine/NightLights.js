import {EarthEngine} from './EarthEngine';

export const NightLights = EarthEngine.extend({

    options: {
        id: 'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS',
        name: 'Nighttime lights',
        filterDate: ['2013-01-01', '2014-01-31'],
        description: '',
        attribution: '<a href="https://explorer.earthengine.google.com/#detail/NOAA%2FDMSP-OLS%2FNIGHTTIME_LIGHTS" target="_blank">NOAA</a>',
    },

    createImage() {
        const options = this.options;
        const legend = this._legend;
        let eeImage;
        let collection = ee.ImageCollection(options.id); // eslint-disable-line
        let zones;

        collection = collection.filterDate(options.filterDate[0], options.filterDate[1]); // eslint-disable-line

        eeImage = ee.Image(collection.select('stable_lights').first());
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

export default function nightLights(options) {
    return new NightLights(options);
}
