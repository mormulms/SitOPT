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
        api.sensorCache.find({objectID : data.params.objectID, sensorType: data.params.sensorType}, function(err, obj) {
            if (err) {
                next(err);
            } else {
                var value = obj[0];
                var start = value.timeStamp;
                var end = new Date(start + 300000);
                var preStart = new Date(start - 300000);
                for (var i = 1; i < obj.length(); i++) {
                    if (start > obj[i].timeStamp) {
                        value = obj[i];
                        start = obj[i].timeStamp;
                        end = new Date(start + 300000);
                        preStart = new Date(start - 300000);
                    }
                }
                data.response.payload = value;
                next();
            }
        });
    }
};