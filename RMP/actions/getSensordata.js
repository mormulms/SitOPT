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
        sensorID : {required : true}
    },

    run: function(api, data, next){
        var error = null;

        api.sensorCache.find({objectID : data.params.objectID, sensorID: data.params.sensorID}, function(err, obj) {
            if (err) {
                next(err);
            } else {
                data.response.payload = obj[0];
                next(null);
            }
        });
    }
};