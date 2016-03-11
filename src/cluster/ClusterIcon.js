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

        this._div = div;

        this.setColor();

        return div;
    },

    setSize(size) {
        this.options.iconSize = [size, size];
        this._setIconStyles(this._div, 'icon');
    },

    setCount(count) {
        let num;

        if (count >= 1000 && count < 9500) {
            num = (count / 1000).toFixed(1) + 'k'; // 3.3k
        } else if (count >= 9500 && count < 999500) {
            num = Math.round(count / 1000) + 'k';  // 33k
        } else if (count >= 999500 && count < 1950000) {
            num = (count / 1000000).toFixed(1) + 'M'; // 3.3M
        } else if (count > 1950000) {
            num = Math.round(count / 1000000) + 'M';  // 33M
        }

        this._div.innerHTML = '<span>' + (num || count) + '</span>';
    },

    setColor(color) {
        this._div.style.background = color || this.options.color;
    },

    createShadow() {
        return null;
    },
});

export default function clusterIcon(options) {
    return new ClusterIcon(options);
}
