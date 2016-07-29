import {EarthEngine} from './EarthEngine';

// https://explorer.earthengine.google.com/#detail/NOAA%2FGFS0P25
// https://developers.google.com/earth-engine/ic_info
// https://groups.google.com/forum/?fromgroups#!searchin/google-earth-engine-developers/Precipitation
export const Precipitation = EarthEngine.extend({

    options: {
        id: 'NOAA/GFS0P25',
        name: 'Precipitation',
        //select: 'precipitation', // 'total_precipitation_surface',
        idProperty: 'system:index',
        filter: [{
            type: 'eq',
            arguments: ['forecast_time', 1435719600000]
        }],
        sort: [{
            property: 'system:time_start',
            ascending: false,
        }],
        description: '',
        attribution: '',
        maxLength: 10000
    },

    createImage() {
        const options = this.options;
        const legend = this._legend;
        let collection = ee.ImageCollection(options.id); // eslint-disable-line
        let eeImage = ee.Image(collection.sort('system:time_start', false).first()); // Most recent image
        let zones;

        // this.getCollection(list => console.log('collection', list));
        // console.log(eeImage.getInfo());

        // Mask out 0-values
        eeImage = eeImage.updateMask(eeImage.gt(0));

        eeImage = this.classifyImage(eeImage);

        const eeImageRGB = eeImage.visualize({
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

    // Returns collection of images
    getCollection(callback) {
        const options = this.options;
        const collection = ee.ImageCollection(options.id).sort('system:time_start', false); // eslint-disable-line

        // TODO: More effective way to return only the properties needed?
        collection.getInfo(data => {
            callback(data.features.map(feature => {
                return {
                    id: feature.properties['system:index'],
                    name: feature.properties['system:index'],
                };
            }));
        });
    },

});

export default function precipitation(options) {
    return new Precipitation(options);
}


//const dateRange = collection.get('date_range').getInfo();
//const startDate = new Date(dateRange[0]);
//const endDate = new Date(dateRange[1]);

/*
 if (options.select) { // Select band
 collection = collection.select(options.select);
 }
 */

//collection = collection.sort('system:time_start', false); // Newest first

//console.log(collection.getInfo());



//collection = collection.sort('system:time_start', false); // Newest first

//console.log(collection.getInfo(), collection.first());

//console.log(collection.toList(10).getInfo());

// console.log('date_range', collection.get('date_range').getInfo());

//const dates = ee.List(collection.get('date_range'));
//const dateRange = ee.DateRange(dates.get(0), dates.get(1));


/*
 for (const filter of options.filter) {
 collection = collection.filter(ee.Filter[filter.type].apply(this, filter.arguments));  // eslint-disable-line
 eeImage = collection.mosaic(); // Better to return first (an only) image in collection?
 }
 */


//console.log('eeImage', collection.getInfo());

// const properties = eeImage.getInfo().properties;
// const startTime = properties['system:time_start'];
// const endTime = properties['system:time_end'];

// console.log('image', properties, new Date(startTime), new Date(endTime));