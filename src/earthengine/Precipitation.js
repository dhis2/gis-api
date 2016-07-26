import {EarthEngine} from './EarthEngine';

// https://explorer.earthengine.google.com/#detail/NOAA%2FGFS0P25
// https://developers.google.com/earth-engine/ic_info
// https://groups.google.com/forum/?fromgroups#!searchin/google-earth-engine-developers/Precipitation
export const Precipitation = EarthEngine.extend({

    options: {
        id: 'NOAA/GFS0P25',
        name: 'Precipitation',
        select: 'total_precipitation_surface',
        filter: [{
            type: 'eq',
            arguments: ['forecast_time', 1435719600000]
        }],
        description: '',
        attribution: ''
    },

    createImage() {
        const options = this.options;
        const legend = this._legend;
        let eeImage;
        let collection = ee.ImageCollection(options.id); // eslint-disable-line
        let zones;

        if (options.select) {
            collection = collection.select(options.select);
        }

        // console.log(collection.toList(50000).length().getInfo()); // 20292

        console.log('date_range', collection.get('date_range').getInfo());

        //const dates = ee.List(collection.get('date_range'));
        //const dateRange = ee.DateRange(dates.get(0), dates.get(1));



        for (const filter of options.filter) {
            collection = collection.filter(ee.Filter[filter.type].apply(this, filter.arguments));  // eslint-disable-line
            eeImage = collection.mosaic(); // Better to return first (an only) image in collection?
        }


        //console.log('eeImage', collection.getInfo());

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




        // forecast_time = 1435719600000



        /*



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
         */
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

export default function precipitation(options) {
    return new Precipitation(options);
}
