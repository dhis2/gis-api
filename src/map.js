import L from 'leaflet';

L.dhis2 = L.dhis2 || {};

L.dhis2.Map = L.Map.extend({

    initialize: function (id, options) {
        L.Map.prototype.initialize.call(this, id, options);

        console.log(id, options);
    }

});

L.dhis2.map = function (id, options) {
    return new L.dhis2.Map(id, options);
};
