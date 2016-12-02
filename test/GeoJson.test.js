import {GeoJson} from '../src/GeoJson';

describe('DHIS2 GeoJSON layer', () => {
    let layer;

    beforeEach(() => {
        layer = new GeoJson();
    });

    it('should extend L.GeoJSON', () => {
        expect(layer).to.be.instanceOf(L.GeoJSON);
    });

    it('should have an addLayer method', () => {
        expect(layer.addLayer).to.be.a('function');
    });

    it('should have an addLabel method', () => {
        expect(layer.addLabel).to.be.a('function');
    });

    it('should have setOpacity method', () => {
        expect(layer.setOpacity).to.be.a('function');
    });

    it('should have findById method', () => {
        expect(layer.findById).to.be.a('function');
    });

});