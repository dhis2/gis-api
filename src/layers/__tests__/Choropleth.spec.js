import L from 'leaflet';
import {Choropleth} from '../Choropleth';

describe('DHIS2 choropleth', () => {

    it('should extend L.GeoJSON', () => {
        const choropleth = new Choropleth({});
        expect(choropleth).toBeInstanceOf(L.GeoJSON);
    });

});