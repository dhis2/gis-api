import L from '../src/index';
import Leaflet from 'leaflet';

describe('DHIS2 GIS', () => {
    it('should export the Leaflet instance', () => {
        expect(L).to.equal(Leaflet);
    });

    it('should add dhis2 namespace to Leaflet instance', () => {
        expect(L.dhis2).to.be.a('object');
    });

    it('should add DHIS2 map to Leaflet instance', () => {
        expect(L.dhis2.Map).to.be.a('function');
        expect(L.dhis2.map).to.be.a('function');
    });

    it('should add DHIS2 cluster to Leaflet instance', () => {
        expect(L.dhis2.Cluster).to.be.a('function');
        expect(L.dhis2.cluster).to.be.a('function');
    });

    it('should have added Google Maps to Leaflet instance', () => {
        expect(L.Google).to.be.a('function');
    });
});
