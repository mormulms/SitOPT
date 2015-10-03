exports.action = {
    name:                   'getSensor',
    description:            'getSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        sensorID: {required: true},
        objectID: {required: true}
    },

    run: function(api, data, next) {
        api.sensor.findOne({sensorID: data.params.sensorID, objectID: data.params.objectID}, function (err, sensor) {
            if (err) {
                next(err);
            } else {
                data.response.payload = sensor;
            }
        });
    }
};