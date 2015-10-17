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
        if (!(data.params.sensorType == null && data.params.sensorUrl == null && data.params.timeStamp == null)) {
            api.db.view('query/findByObject', {key: data.params.objectID}, function(err, res) {
                if (err) {
                    next(err);
                } else {
                    if (res.length == 0) {
                        next('resource not found');
                    } else {
                        res.forEach(function (key, row, id) {
                            if (row == data.params.sensorID) {
                                api.db.get(id, function (element) {
                                    var sensorType = data.params.sensorType || element.sensorType;
                                    var sensorUrl = data.params.sensorUrl || element.sensorUrl;
                                    var timeStamp = data.params.timeStamp || new Date();
                                    var match = sensorUrl.match(/^https?:\/\/(localhost|[a-zA-Z0-9.-]+\.[a-zA-Z]+)(:[0-9]+)?(\/$|\/[^\/]+)*$/);
                                    if (match != null && sensorUrl.length == match[0].length) {
                                        api.db.save(id, {
                                            sensorID: data.params.sensorID.toString(),
                                            objectID: data.params.objectID.toString(),
                                            sensorType: sensorType,
                                            sensorUrl: sensorUrl,
                                            timeStamp: timeStamp
                                        }, function (error, result) {
                                            if (error) {
                                                next(error);
                                            } else {
                                                data.response.payload = result;
                                                next(null);
                                            }
                                        });
                                    } else {
                                        next('sensorUrl not a URL');
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    }
};