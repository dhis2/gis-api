import L from "leaflet";
import layerMixin from "./layerMixin";
import layerTypes from "./layerTypes";
import { getBoundsFromLayers, toLngLatBounds } from "../utils/geometry";

export const LayerGroup = L.LayerGroup.extend({
  ...layerMixin,
  _current_index: 0,

  initialize({ layers, ...options }) {
    L.LayerGroup.prototype.initialize.call(this, null, {
      ...options,
      pane: options.id
    });

    if (layers && layers.length) {
      layers.forEach(layer => {
        this.addLayer(layer);
      });
    }
  },

  addLayer(options) {
    const { id, opacity, isVisible } = this.options;

    const layerType = layerTypes[options.type];
    if (layerType) {
      const layer = layerType({
        ...options,
        id: `${id}-${this._current_index}`,
        opacity,
        isVisible
      });
      L.LayerGroup.prototype.addLayer.call(this, layer);

      ++this._current_index;
    }
  },

  createPane(map) {
    this.invoke("createPane", map);
  },

  setIndex(index) {
    const zIndex = 200 + index * 10;

    this.getLayers().forEach((layer, i) => {
      if (layer.getPane()) {
        layer.getPane().style.zIndex = zIndex + i;
      }
    });

    this.options.index = index;
  },

  setOpacity(opacity) {
    this.invoke("setOpacity", opacity);
  },

  setVisibility(isVisible) {
    this.invoke("setVisibility", isVisible);
  },

  getBounds() {
    return toLngLatBounds(getBoundsFromLayers(this.getLayers()));
  },

  onAdd(map) {
    L.LayerGroup.prototype.onAdd.call(this, map);
    this._map = map;
    this.setIndex(this.options.index);
  }
});

export default function layerGroup(options) {
  return new LayerGroup(options);
}
