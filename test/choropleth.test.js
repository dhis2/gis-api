import L from 'leaflet';
import {Choropleth} from '../srcx/Choropleth';

describe('DHIS2 choropleth', () => {

    it('should extend L.GeoJSON', () => {
        let choropleth = new Choropleth();
        expect(choropleth).to.be.instanceOf(L.GeoJSON);
    });

});