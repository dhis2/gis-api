import L from 'leaflet';
import {EarthEngine} from '../src/EarthEngine';

describe('DHIS2 Earth Engine', () => {

    it('should extend L.TileLayer', () => {
        let earthengine = new EarthEngine();
        expect(earthengine).to.be.instanceOf(L.TileLayer);
    });

});