exports.action = {
    name:                   'getSensordata',
    description:            'getSensordata',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        objectID : {required : true},
        sensorType : {required : true}
    },

    run: function(api, data, next) {
        api.sensor.find({objectID: data.params.objectID, sensorType: data.params.sensorType}, function (err, sensors) {
            var ids = [];
            if (err) {
                next(err);
            } else {
                for (var i = 0; i < sensors.length; i++) {
                    ids.push(sensors[i].sensorID);
                }
                api.sensorCache.find({sensorID: { $in: ids }}, function (error, cache) {
                    var val = cache[0];
                    var start = new Date();
                    var end = new Date(start - 60000);
                    for (var i = 1; i < cache.length; i++) {
                        if (val.timeStamp < cache[i].timeStamp) {
                            val = cache[i];
                        }
                    }
                    data.response.payload = val;
                    next();
                })
            }
        });
    }
};