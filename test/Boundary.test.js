import L from 'leaflet';
import {Boundary} from '../src/Boundary';

describe('DHIS2 boundary layer', () => {

    it('should extend L.GeoJSON', () => {
        const boundary = new Boundary();
        expect(boundary).to.be.instanceOf(L.GeoJSON);
    });

});