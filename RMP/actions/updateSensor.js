exports.action = {
    name:                   'updateSensor',
    description:            'updateSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        sensorID: {required: true},
        objectID: {required: true},
        sensorUrl: {required: false},
        sensorType: {required: false},
        timeStamp: {required: false}
    },

    run: function(api, data, next){
        var updates = {};
        updates.sensorID = data.params.sensorID;
        updates.objectID = data.params.objectID;
        if (data.params.sensorUrl != null) {
            updates.sensorUrl = data.params.sensorUrl;
        }
        if (data.params.sensorType != null) {
            updates.sensorType = data.params.sensorType;
        }
        if (data.params.timeStamp != null) {
            updates.timestamp = data.params.timeStamp;
        } else {
            updates.timestamp = new Date();
        }
        if (!(data.params.sensorType == null && data.params.sensorUrl == null)) {
            api.sensor.update({sensorID: data.params.sensorID, objectID: data.params.objectID}, updates, function (err, amount) {
                if (err) {
                    next(err);
                } else {
                    data.response.amountAffectedRows = amount;
                    next();
                }
            });
        } else {
            next('Not all needed parameters were given.');
        }
    }
};