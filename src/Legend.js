// import L from 'leaflet';

// Map legend control
export const Legend = L.Control.extend({

    options: {
        position: 'topright',
        collapsed: true,
        offset: [0, 0],
    },

    initialize(opts) {
        const options = L.setOptions(this, opts);
        this._content = options.content || '';
        this._handlingClick = false;
    },

    onAdd(map) {
        this._initLayout();
        this._map = map;

        return this._container;
    },

    setContent(content) {
        this._legend.innerHTML = content;
        this._content = content;
    },

    getContent() {
        return this._content;
    },

    _initLayout() {
        const className = 'leaflet-control-legend';
        const container = this._container = L.DomUtil.create('div', className);

        // Makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
        container.setAttribute('aria-haspopup', true);

        L.DomEvent.disableClickPropagation(container);
        if (!L.Browser.touch) {
            L.DomEvent.disableScrollPropagation(container);
        }

        if (this.options.collapsed) {
            if (!L.Browser.android) {
                L.DomEvent.on(container, {
                    mouseenter: this._expand,
                    mouseleave: this._collapse,
                }, this);
            }

            const link = this._legendLink = L.DomUtil.create('a', className + '-toggle', container);
            link.href = '#';
            link.title = 'Legend';

            if (L.Browser.touch) {
                L.DomEvent
                    .on(link, 'click', L.DomEvent.stop)
                    .on(link, 'click', this._expand, this);
            } else {
                L.DomEvent.on(link, 'focus', this._expand, this);
            }

            this._map.on('click', this._collapse, this);
        } else {
            this._expand();
        }

        this._legend = L.DomUtil.create('div', className + '-content', container);
        this.setContent(this._content);
    },

    _expand() {
        const offset = L.point(this.options.offset);
        L.DomUtil.addClass(this._container, 'leaflet-control-legend-expanded');
        this._container.style.left = offset.x + 'px';
        this._container.style.top = offset.y + 'px';
    },

    _collapse() {
        L.DomUtil.removeClass(this._container, 'leaflet-control-legend-expanded');
        this._container.style.left = 0;
        this._container.style.top = 0;
    },

});

export default function legend(options) {
    return new Legend(options);
}
