import L from 'leaflet';
import {Boundary} from '../Boundary';

describe('DHIS2 boundary layer', () => {

    it('should extend L.GeoJSON', () => {
        const boundary = new Boundary({});
        expect(boundary).toBeInstanceOf(L.GeoJSON);
    });

});