import L from 'leaflet';
import {Map} from '../src/Map';

describe('DHIS2 map', () => {
    let map;

    beforeEach(() => {
        map = new Map(document.createElement('div'));
    });

    /*
    afterEach(function () {
        document.body.removeChild(mapDiv);
    });
    */

    it('should export the Leaflet instance', () => {
        expect(map).to.be.instanceOf(L.Map);
    });

    it('should have a addLayer method', () => {
        expect(map.addLayer).to.be.a('function');
    });

    it('should create a TileLayer from config object', () => {
        const layer = map.addLayer({ type: 'tileLayer' });
        expect(layer).to.be.instanceOf(L.TileLayer);
    });

    it('should create a TileLayer.WMS from config object', () => {
        const layer = map.addLayer({ type: 'wmsLayer' });
        expect(layer).to.be.instanceOf(L.TileLayer.WMS);
    });

    it('should create a TileLayer.WMS from config object', () => {
        const layer = map.addLayer({ type: 'wmsLayer' });
        expect(layer).to.be.instanceOf(L.TileLayer.WMS);
    });

    it('should create a L.GridLayer.GoogleMutant from config object', () => {
        const layer = map.addLayer({ type: 'googleLayer' });
        expect(layer).to.be.instanceOf(L.GridLayer.GoogleMutant);
    });

    it('should create a GeoJson layer from boundary config object', () => {
        const layer = map.addLayer({ type: 'boundary' });
        expect(layer).to.be.instanceOf(L.GeoJSON);
    });

    it('should create a GeoJson layer from dots config object', () => {
        const layer = map.addLayer({ type: 'dots' });
        expect(layer).to.be.instanceOf(L.GeoJSON);
    });

    it('should create a GeoJson layer from markers config object', () => {
        const layer = map.addLayer({ type: 'markers' });
        expect(layer).to.be.instanceOf(L.GeoJSON);
    });

    it('should create a GeoJson layer from circles config object', () => {
        const layer = map.addLayer({ type: 'circles' });
        expect(layer).to.be.instanceOf(L.GeoJSON);
    });

    it('should create a GeoJson layer from choropleth config object', () => {
        const layer = map.addLayer({ type: 'choropleth' });
        expect(layer).to.be.instanceOf(L.GeoJSON);
    });

    it('should create a MarkerClusterGroup from client cluster config object', () => {
        const layer = map.addLayer({ type: 'clientCluster' });
        expect(layer).to.be.instanceOf(L.MarkerClusterGroup);
    });

    it('should create a GridLayer from server cluster config object', () => {
        const layer = map.addLayer({ type: 'serverCluster' });
        expect(layer).to.be.instanceOf(L.GridLayer);
    });

    // TODO: Test don't pass - change to TileLayer
    /*
    it('should create a LayerGroup from earth engine config object', () => {
        const layer = map.addLayer({ type: 'earthEngine' });
        expect(layer).to.be.instanceOf(L.LayerGroup);
    });
    */

    it('should have a createLayer method', () => {
        expect(map.createLayer).to.be.a('function');
    });

    it('createLayer method should create a layer from a config object', () => {
        const layer = map.createLayer({ type: 'tileLayer' });
        expect(layer).to.be.instanceOf(L.Layer);
    });

    it('should have an addControl method', () => {
        expect(map.addControl).to.be.a('function');
    });

    it('should create a control from a legend config object', () => {
        const layer = map.addControl({ type: 'legend' });
        expect(layer).to.be.instanceOf(L.Control);
    });

    it('should create a control from a fit bounds config object', () => {
        const layer = map.addControl({ type: 'fitBounds' });
        expect(layer).to.be.instanceOf(L.Control);
    });

    it('should have a getLayersBounds method', () => {
        expect(map.getLayersBounds).to.be.a('function');
    });

    it('getLayersBounds should return a LatLngBounds instance', () => {
        const bounds = map.getLayersBounds();
        expect(bounds).to.be.instanceOf(L.LatLngBounds);
    });

    /*
    it('should have set the basemap layer', () => {
        map = new Map('map', {basemap: 'mapquest'});
        expect(map.hasLayer('mapquest')).to.be.true;
    });
    */

});

