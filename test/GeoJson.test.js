import L from 'leaflet';
import {GeoJson} from '../src/GeoJson';

describe('DHIS2 GeoJSON layer', () => {

    it('should extend L.GeoJSON', () => {
        const geoJson = new GeoJson();
        expect(geoJson).to.be.instanceOf(L.GeoJSON);
    });

});