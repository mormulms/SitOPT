exports.action = {
    name:                   'setSensordata',
    description:            'setSensordata',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        sensorID: {required: true},
        value: {required: true},
        timeStamp: {required: false}
    },

    run: function(api, data, next){
        var error = null;

        var date = data.params.timeStamp || new Date();
        api.sensorCache.findOneAndUpdate({sensorID: data.params.sensorID}, {value: data.params.value, timeStamp: date}, function(err, val) {
            if (err) {
                console.log(err);
                next(err);
            } else if (val != null) {
                console.log(val);
                data.response.payload = val[0];
                next(null);
            } else {
                var obj = new api.sensorCache({sensorID:data.params.sensorID, value: data.params.value, timeStamp: date});
                obj.save(function(err) {
                    if (err) {
                        console.log(err);
                        next(err);
                    } else {

                    }
                });
                data.response.payload = obj;
                next(null);
            }
        });

        next(error);
    }
};