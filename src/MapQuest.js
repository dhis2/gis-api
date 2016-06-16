import L from 'leaflet';
import {TileLayer} from './TileLayer';

export const MapQuest = TileLayer.extend({

    options: {
        url: '//otile{s}-s.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
        subdomains: '1234',
        attribution: '&copy; <a href="http://www.mapquest.com/">MapQuest</a>, &copy; <a href="http://www.openstreetmap.org/about">OpenStreetMap</a>',
        maxZoom: 18,
    },

});

export default function mapQuest(options) {
    return new MapQuest(options);
}
