import {Features} from './Features';
import {linear} from 'd3-scale';

export const CircleMarkers = Features.extend({

    options: {
        style: {
            radius: 10,
            weight: 1,
            fillOpacity: 0.5
        },
        highlight: true,
        labelTemplate: '{na}',
    },

    initialize(options = {}) {
        options.pointToLayer = this.pointToLayer.bind(this); // Bind this

        Features.prototype.initialize.call(this, options);
        this.setFeatureData(options.data);
    },

    //addData(geojson) {
    //    L.GeoJSON.prototype.initialize.call(this, geojson);
    //},

    pointToLayer(geojson, latlng) {
        return new L.CircleMarker(latlng, this.options.style);
    },

    addFeatures(features) {
        console.log("addFeatures", features);


    },

    /*
    setFeatures(features) {
        if (typeof features === 'string') { // URL
            this.loadFeatures(features);
        } else if (typeof features === 'object') {
            this._features = features;
            this.addFeatureData(features, this._data);
        }
    },

    setData(data) {
        if (typeof data === 'string') { // URL
            this.loadData(data);
        } else if (typeof features === 'object') {
            this._data = data;
            this.addFeatureData(this._features, data);
        }
    },

    loadFeatures(url) {
        fetch(url)
            .then(response => response.json())
            .then(features => this.addFeatureData(features, this._data))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    loadData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => this.addFeatureData(this._features, data))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addFeatureData(features, data){
        this._features = features;
        this._data = data;

        console.log("add", features, data);

    },
    */


    //addFeatures(features) {
    //    if (features) {

    //        console.log(features);



            //features.forEach(d => this.addLayer(this.createCircleMarker(d)));

            /*
            this._geojson = features;

            if (Array.isArray(features)) {
                this._geojson = this._dhis2geojson(features);
            }

            this.addData(this._geojson);
            this.addLabels(this.options.labelTemplate);
            */
//        }
//    },


    /*
    setFeatureData(data) {
        if (typeof data === 'string') { // URL
            this.loadFeatureData(data);
        } else if (typeof features === 'object') {
            this.addFeatureData(data);
        }
    },

    loadFeatureData(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addFeatureData.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    addFeatureDataxxx(data) {
        if (data) {
            this._data = data;

            console.log(data);



            /*
            if (data && this._geojson) {
                this._data = this._parseData(data);

                this.eachLayer(layer => {
                    layer.bindLabel(layer.feature.properties.na + ' ' + this._data[layer.feature.id], {
                        direction: 'auto',
                    });
                });

                this.setStyle(feature => ({
                    fillColor: this._scale(this._data[feature.id]),
                }));
            }

        }
    },

    _mergeFeatureData: function () {



    },

    // Load DHIS2 data
    /*
    loadData(url) {
        fetch(url)
            .then(response => response.json())
            .then(this.addData.bind(this))
            .catch(ex => window.console.log('parsing failed', ex));
    },

    // Add DHIS2 data
    addData(data) {
        if (data) { // Create markers from data
            data.forEach(d => this.addLayer(this.createCircleMarker(d)));
        }
    },


    createCircleMarker(item) {
        const circleMarker = L.circleMarker(item.co.reverse(), this.options.style);

        circleMarker.bindPopup(item.na);
        circleMarker.bindLabel(item.na);

        return circleMarker;
    },

    _parseData(features) {
        //console.log


    },
     */

});

export default function circleMarkers(options) {
    return new CircleMarkers(options);
}
