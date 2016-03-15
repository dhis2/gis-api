import L from 'leaflet';
import clusterIcon from './ClusterIcon';

export const ClusterMarker = L.Marker.extend({
    initialize(latlng, options) {
        options.icon = clusterIcon({
            // html: `<span>${options.count}</span>`,
            // iconSize: [options.size, options.size],
            size: options.size,
            color: options.color,
            count: options.count,
        });

        L.setOptions(this, options);
        this._latlng = L.latLng(latlng);
    },

    setSize(size, count) {
        const icon = this.options.icon;
        icon.setSize(size);
        icon.setCount(count);
    },
});

export default function clusterMarker(latlng, options) {
    return new ClusterMarker(latlng, options);
}
