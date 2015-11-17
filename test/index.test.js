import L from '../src/index';
import Leaflet from 'leaflet';

describe('DHIS2 GIS', () => {
    it('should export the Leaflet instance', () => {
        expect(L).to.equal(Leaflet);
    });

    it('should add the MarkerClusterGroup to Leaflet', () => {
        expect(L.MarkerClusterGroup).to.be.a('function');
    });

    it('should have added Google to Leaflet', () => {
        expect(L.Google).to.be.a('function');
    });
});
