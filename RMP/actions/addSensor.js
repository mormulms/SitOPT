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
        timeStamp: {required: false}
    },

    run: function(api, data, next){
        var async = require('async');
        var timestamp = data.params.timeStamp || new Date();
        var sensorUrl = data.params.sensorUrl;
        if (sensorUrl.length != sensorUrl.match(/^(https?|mqtt):\/\/(localhost|[a-zA-Z0-9.-]+\.[a-zA-Z]+)(:[0-9]+)?(\/$|\/[^\/]+)*$/)[0].length) {
            next('Sensor URL was not a URL');
        } else {
            api.sensor.find({sensorID: data.params.sensorID, objectID: data.params.objectID}, function (err, result) {
                if (err) {
                    next(err);
                } else if (result.length > 0) {
                    next('Sensor already exists');
                } else {
                    var sensor = new api.sensor({sensorID: data.params.sensorID, objectID: data.params.objectID, sensorType: data.params.sensorType, sensorUrl: sensorUrl, timestamp: timestamp});
                    async.waterfall([
                        save,
                        function () {
                            data.response.payload = sensor;
                            next();
                        }
                    ])
                    var save = function() {
                        sensor.save(function (err) {
                            if (err) {
                                next(err);
                            }
                        });
                    }

                }
            })
        }
    }
};