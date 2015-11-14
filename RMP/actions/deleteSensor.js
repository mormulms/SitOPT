exports.action = {
    name:                   'deleteSensor',
    description:            'deleteSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        objectID: {required: true},
        sensorID: {required: false}
    },

    run: function(api, data, next){
        api.sensor.findOne({sensorID: data.params.sensorID}).remove(function (err) {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    }
};