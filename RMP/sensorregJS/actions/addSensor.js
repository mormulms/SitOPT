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
        var error = null;
        var async = require('async');

        var time = data.params.timeStamp || new Date();
        api.db.view('query/findByObject', {key: data.params.objectID}, function(err, res) {
            if (err) {
                next(err);
            } else {
                var found = false;
                async.waterfall(
                    res.forEach(function(key, row, id) {
                        if (row == data.params.sensorID) {
                            found = true;
                            next('resource already exists');
                        }
                    }),
                    function() {
                        if (!found) {
                            var match = data.params.sensorUrl.match(/^https?:\/\/(localhost|[a-zA-Z0-9.-]+\.[a-zA-Z]+)(:[0-9]+)?(\/$|\/[^\/]+)*$/)[0];
                            if (match != null && match.length == data.params.sensorUrl.length) {
                                api.db.save({
                                    sensorID: data.params.sensorID,
                                    objectID: data.params.objectID,
                                    sensorUrl: data.params.sensorUrl,
                                    sensorType: data.params.sensorType,
                                    timeStamp: time
                                }, function (err, res) {
                                    if (err) {
                                        data.response.payload = false;
                                        next(err);
                                    } else {
                                        data.response.payload = true;
                                        data.response.sensor = res;
                                        next(null);
                                    }
                                });
                            } else {
                                next('sensorUrl not a URL');
                            }
                        }
                    }
                );
            }
        });

        next(error);
    }
};