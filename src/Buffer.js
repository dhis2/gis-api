import turfBuffer from '@turf/buffer';
import {GeoJson} from './GeoJson';

// console.log('turfBuffer', turfBuffer);

export const Buffer = GeoJson.extend({

  options: {
    style: {
      opacity: 1,
      fillOpacity: 0,
      fill: false,
      radius: 5,
    },
    highlightStyle: {
      weight: 3,
    },
  },

  initialize(options = {}) {
    if (!options.pointToLayer) {
      options.pointToLayer = this.pointToLayer.bind(this);
    }

    const polygons = options.data.filter(feature => feature.geometry.type !== 'Point');

    console.log('buffer polygon', options.buffer / 1000);

    polygons.forEach(feature => feature.geometry = turfBuffer(feature, options.buffer / 1000).geometry);

    // const buffered = turfBuffer(polygons[0], 500);



    //console.log(polygons[0], buffered);

    GeoJson.prototype.initialize.call(this, options);
  },

  addLayer(layer) {
    const prop = layer.feature.properties;

    if (prop.style) {
      layer.setStyle(prop.style);
    }

    GeoJson.prototype.addLayer.call(this, layer);
  },

  // Set opacity for all features
  setOpacity(opacity) {
    this.setStyle({
      opacity,
    });
  },

  // Use circle markers for point features
  pointToLayer(geojson, latlng) {
    this.options.style.pane = this.options.pane;

    console.log('radius', this.options.buffer);

    return L.circle(latlng, {
      ...this.options.style,
      radius: this.options.buffer,
    });
  },

  // Higlight feature based on id
  highlight(id) {
    const layer = this.findById(id);

    this.removeHighlight();

    if (layer) {
      this._highlight = layer.setStyle({
        fillOpacity: 0.5,
      });
      return layer;
    }
  },

  // Remove highlight from feature
  removeHighlight() {
    if (this._highlight) {
      this._highlight.setStyle({
        fillOpacity: 0,
      });
    }
  },

});

export default function buffer(options) {
  return new Buffer(options);
}
