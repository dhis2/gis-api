import L from 'leaflet'
import fitBounds from './FitBounds'
import search from './Search'
import measure from './Measure'

export default {
    fitBounds,
    search,
    measure,
    zoom: L.control.zoom,
    scale: L.control.scale,
}
