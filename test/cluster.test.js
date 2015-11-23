import L from 'leaflet';
import {Cluster} from '../src/Cluster';

describe('DHIS2 marker cluster', () => {

    it('should extend Leaflet.markercluster', () => {
        let cluster = new Cluster();
        expect(cluster).to.be.instanceOf(L.MarkerClusterGroup);
    });

});
