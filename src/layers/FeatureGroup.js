import L from "leaflet";
import layerMixin from "./layerMixin";
import { Circles } from "./Circles";
import { LabelGroup } from "./LabelGroup";
import { toLngLatBounds } from "../utils/geometry";

// Layer group with support for labels and buffers
export const FeatureGroup = L.FeatureGroup.extend({
  ...layerMixin,

  initialize(options) {
    L.FeatureGroup.prototype.initialize.call(this, null, {
      ...options,
      pane: options.id
    });
  },

  addBuffers() {
    const { buffer, bufferStyle, data, pane } = this.options;

    if (buffer) {
      this.addLayer(
        new Circles({
          pane: `${pane}-buffer`,
          radius: buffer,
          ...(bufferStyle && { style: bufferStyle }),
          data
        })
      );
    }
  },

  addLabels() {
    const { data, label, labelStyle, pane } = this.options;

    if (label) {
      this.addLayer(
        new LabelGroup({
          pane: `${pane}-label`,
          style: labelStyle,
          label,
          data
        })
      );
    }
  },

  createPane(map) {
    this.invoke("createPane", map);
  },

  setIndex(index) {
    const zIndex = 200 + index * 10;

    this.getLayers().forEach((layer, i) => {
      layer.getPane().style.zIndex = zIndex + i;
    });

    this.options.index = index;
  },

  setOpacity(opacity) {
    this.invoke("setOpacity", opacity);
  },

  setVisibility(isVisible) {
    this.invoke("setVisibility", isVisible);
  },

  // Convert bounds before returning
  getBounds() {
    const bounds = L.FeatureGroup.prototype.getBounds.call(this);
    return toLngLatBounds(bounds);
  }
});

export default FeatureGroup;
