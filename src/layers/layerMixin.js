const getZIndex = index => 200 + (index * 10);

const layerMixin = {
    createPane(map) {
        const { pane } = this.options;

        if (pane && !map.getPane(pane)) {
            map.createPane(pane);
        }
    },

    setIndex(index) {
        if (index) {
            this.getPane().style.zIndex = getZIndex(index);
            this.options.index = index;
        }
    },

    setVisibility(isVisible) {
        if (this._map) {
            const pane = this._map.getPane(this.options.pane);

            if (isVisible) {
                pane.style.display = 'block';
                this._map.addLayer(this);
            } else {
                pane.style.display = 'none';
            }
        }

        this.options.isVisible = isVisible;
    },
};

export default layerMixin;
