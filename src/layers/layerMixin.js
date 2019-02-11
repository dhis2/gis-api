const layerMixin = {
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
