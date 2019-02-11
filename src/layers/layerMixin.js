const layerMixin = {
    createPane(map) {
        const { pane } = this.options;

        if (pane && !map.getPane(pane)) {
            map.createPane(pane);
        }
    },

    setIndex(index) {
        const zIndex = 200 + (index * 10);

        this.getPane().style.zIndex = zIndex;
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
    },
};

export default layerMixin;
