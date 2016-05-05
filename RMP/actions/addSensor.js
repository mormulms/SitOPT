/**
 * Adds a sensor to the MongoDB, in the Sensor Registration part.
 */
exports.action = {
    name:                   'addSensor',
    description:            'addSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        sensorID: {required: true},
        objectID: {required: true},
        sensorUrl: {required: true},
        sensorType: {required: true},
        timeStamp: {required: false},
        quality: {required: true},
        unit: {required: true},
        unitSymbol: {required: true}
    },

    run: function(api, data, next){
        var async = require('async');
        var timestamp = data.params.timeStamp || new Date();
        var sensorUrl = data.params.sensorUrl;
        console.log("id: " + data.params.sensorID);
        api.sensor.find({sensorID: data.params.sensorID}, function (err, result) {
            if (err) {
                data.response.error = err;
                next(err);
            } else if (result.length > 0) {
                data.response.error = 'Sensor already exists';
                //Sensor does not need to be added.
                next('Sensor already exists');
            } else {
                // Add Sensor
                var sensor = new api.sensor({
                    sensorID: data.params.sensorID,
                    objectID: data.params.objectID,
                    sensorType: data.params.sensorType,
                    sensorUrl: sensorUrl,
                    timestamp: timestamp.toString(),
                    quality: data.params.quality,
                    unit: data.params.unit,
                    unitSymbol: data.params.unitSymbol
                });
                sensor.save(function (err) {
                    if (err) {
                        data.response.error = err;
                        next(err);
                    } else {
                        data.response.payload = sensor;
                        next();
                    }
                });
            };
        });
    }
};