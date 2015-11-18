//import './googlemapsapi.js';
import L from 'leaflet';
import {Cluster} from '../src/cluster';

describe('DHIS2 marker cluster', () => {

    it('should extend Leaflet.markercluster', () => {
        let cluster = new Cluster();
        expect(cluster).to.be.instanceOf(L.MarkerClusterGroup);
    });

});
