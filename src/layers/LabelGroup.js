import L from "leaflet";
import label from "./Label";
import polylabel from "polylabel";
import layerMixin from "./layerMixin";

const geojsonArea = require("geojson-area");

export const LabelGroup = L.FeatureGroup.extend({
  ...layerMixin,

  initialize(options) {
    L.FeatureGroup.prototype.initialize.call(this, null, options);
    options.data.forEach(feature => this.addLabel(feature));
  },

  // Add label to layer
  addLabel(feature) {
    const { options } = this;
    const { properties, geometry } = feature;
    const { style } = properties;
    const text = L.Util.template(options.label, properties);
    const labelStyle = { ...properties.labelStyle, ...options.style };
    const latlng = this._getLabelLatlng(geometry);

    if (style && style.color) {
      labelStyle.color = style.color;
    }

    this.addLayer(
      label(latlng, {
        html: text,
        position: geometry.type === "Point" ? "below" : "middle",
        labelStyle,
        pane: options.pane
      })
    );
  },

  // Returns the best label placement
  _getLabelLatlng(geometry) {
    const coords = geometry.coordinates;
    let biggestRing;

    if (geometry.type === "Point") {
      return [coords[1], coords[0]];
    } else if (geometry.type === "Polygon") {
      biggestRing = coords;
    } else if (geometry.type === "MultiPolygon") {
      biggestRing = coords[0];

      // If more than one polygon, place the label on the polygon with the biggest area
      if (coords.length > 1) {
        let biggestSize = 0;

        coords.forEach(ring => {
          const size = geojsonArea.ring(ring[0]); // Area calculation

          if (size > biggestSize) {
            biggestRing = ring;
            biggestSize = size;
          }
        });
      }
    }

    // Returns pole of inaccessibility, the most distant internal point from the polygon outline
    return polylabel(biggestRing, 2).reverse();
  },

  setOpacity(opacity) {
    this.invoke("setOpacity", opacity);
  }
});

export default LabelGroup;
