import L from 'leaflet';

export const ClusterIcon = L.Icon.extend({
    options: {
        iconSize: [20, 20],
        className: 'leaflet-cluster-icon',
        html: false,
    },

    createIcon(oldIcon) {
        const div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div');
        const options = this.options;

        div.innerHTML = options.html !== false ? options.html : '';

        if (options.bgPos) {
            const bgPos = L.point(options.bgPos);
            div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
        }
        this._setIconStyles(div, 'icon');

        this._style = div.style;

        this.setColor();

        return div;
    },

    setColor(color) {
        this._style.background = color || this.options.color;
    },

    createShadow() {
        return null;
    },
});

export default function clusterIcon(options) {
    return new ClusterIcon(options);
}
