import L from 'leaflet';
import tileLayer from './layers/TileLayer';
import wmsLayer from './layers/WmsLayer';
import googleLayer from './layers/GoogleLayer';
import geoJson from './layers/GeoJson';
import boundary from './layers/Boundary';
import dots from './layers/Dots';
import markers from './layers/Markers';
import choropleth from './layers/Choropleth';
import clientCluster from './layers/ClientCluster';
import serverCluster from './layers/ServerCluster';
import earthEngine from './layers/EarthEngine';
import legend from './controls/Legend';
import fitBounds from './controls/FitBounds';
import search from './controls/Search';
import measure from './controls/Measure';
import { toLatLng, toLatLngBounds, toLngLatBounds } from './utils/geometry';

export class Map extends L.Evented {
    options = {
        className: 'leaflet-dhis2',
        zoomControl: false,
        controls: [],
        worldCopyJump: true,
        maxZoom: 18,
        layerTypes: {
            tileLayer, // CartoDB basemap
            wmsLayer, // WMS layer
            googleLayer, // Google basemap
            geoJson, // GeoJSON layer
            boundary, // Boundary layer
            dots, // Event layer without clustering
            markers, // Facility layer
            choropleth, // Thematic layer
            clientCluster, // Event layer
            serverCluster, // Event layer
            earthEngine, // Google Earth Engine layer
        },
        controlTypes: {
            legend,
            fitBounds,
            search,
            measure,
        },
    };

    constructor(el, opts) {
        super();

        const options = L.setOptions(this, opts);

        this._layers = [];

        this._map = L.map(el, options);

        this._map.attributionControl.setPrefix('');

        L.DomUtil.addClass(this.getContainer(), options.className);

        L.Icon.Default.imagePath = '/images/';

        // Stop propagation to prevent dashboard dragging
        this._map.on('mousedown', evt => evt.originalEvent.stopPropagation());

        if (options.bounds) {
            this.fitBounds(options.bounds);
        }

        for (const control in options.controls) {
            if (options.controls.hasOwnProperty(control)) {
                this.addControl(control);
            }
        }

        this._map.on('click', evt => this.onClick(evt));
        this._map.on('contextmenu', evt => this.onContextMenu(evt));
    }

    getContainer() {
        return this._map.getContainer();
    }

    getLeafletMap() {
        return this._map;
    }

    // Accept layer as config object
    addLayer(layer) {
        const { layerTypes } = this.options;
        let newLayer = layer;

        if (layer.type && layerTypes[layer.type]) {
            newLayer = this.createLayer(layer);
        }

        newLayer.createPane(this._map);

        this._map.addLayer(newLayer);
        this._layers.push(newLayer);

        return newLayer;
    }

    removeLayer(layer) {
        this._layers = this._layers.filter(l => l !== layer);
        return this._map.removeLayer(layer);
    }

    hasLayer(layer) {
        return this._map.hasLayer(layer);
    }

    remove() {
        this._map.remove();
    }

    createLayer(layer) {
        return this.options.layerTypes[layer.type](layer);
    }

    addControl(control) {
        const { position, type } = control;
        const { controlTypes } = this.options;

        if (position) {
            control.position = position.replace(/-/, '');
        }

        let newControl = control;

        if (type && controlTypes[type]) {
            newControl = controlTypes[type](control);
        } else if (type && L.control[type]) {
            newControl = L.control[type](control);
        }

        this._map.addControl(newControl);
        return newControl;
    }

    fitBounds(bounds) {
        if (bounds) {
            this._map.fitBounds(toLatLngBounds(bounds));
        }
    }

    fitWorld() {
        this._map.fitWorld();
    }

    setView(lnglat, zoom) {
        this._map.setView(toLatLng(lnglat), zoom);
    }

    getLayers() {
        return this._layers;
    }

    // Returns the combined bounds for all vector layers
    getLayersBounds() {
        const bounds = new L.LatLngBounds();

        this._map.eachLayer(layer => {
            if (layer.options.index && !layer.feature) {
                const layerBounds = layer.getBounds();
                if (layerBounds.extend) {
                    bounds.extend(layerBounds);
                }
            }
        });

        if (bounds.isValid()) {
            return toLngLatBounds(bounds);
        }
    }

    // Returns true if the layer type is supported
    hasLayerSupport(type) {
        return !!this.options.layerTypes[type];
    }

    openPopup(content, lnglat, onClose) {
        this._map.openPopup(content, toLatLng(lnglat));

        if (typeof onClose === 'function') {
            this._map.once('popupclose', onClose);
        }
    }

    resize() {
        this._map.invalidateSize();
    }

    onClick(evt) {
        this.fire('click', this._createClickEvent(evt));
    }

    onContextMenu(evt) {
        this.fire('contextmenu', this._createClickEvent(evt));
    }

    _createClickEvent(evt) {
        const { type, latlng, originalEvent } = evt;
        const coordinates = [latlng.lng, latlng.lat];
        const position = [originalEvent.x, originalEvent.pageY || originalEvent.y];

        return { type, coordinates, position };
    }
}

export default Map;
