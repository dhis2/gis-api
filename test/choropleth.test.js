import L from 'leaflet';
import {Choropleth} from '../src/choropleth';

describe('DHIS2 choropleth', () => {

    it('should extend L.GeoJSON', () => {
        let choropleth = new Choropleth();
        expect(choropleth).to.be.instanceOf(L.GeoJSON);
    });

});