// import L from 'leaflet';
import {hcl} from 'd3-color';

export const ClusterIcon = L.Icon.extend({
    options: {
        className: 'leaflet-cluster-icon',
    },

    createIcon(oldIcon) {
        const options = this.options;
        this._div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div');

        this.setSize(options.size);
        this.setCount(options.count);
        this.setColor(options.color);
        this.setOpacity(options.opacity);

        return this._div;
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
        this._div.style.background = color;
        this._div.style.color = hcl(color).l < 70 ? '#fff' : '#000';
    },

    setOpacity(opacity) {
        this._div.style.opacity = opacity;
    },

    createShadow() {
        return null;
    },
});

export default function clusterIcon(options) {
    return new ClusterIcon(options);
}
