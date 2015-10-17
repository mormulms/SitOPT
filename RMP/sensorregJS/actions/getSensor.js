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

    run: function(api, data, next){

        api.db.view('query/findByObject', {key: data.params.objectID}, function(err, res) {
            if (err) {
                next(err);
            } else {
                if (res.length == 0) {
                    next('resource not found');
                } else {
                    res.forEach(function (key, row, id) {
                        if (row == data.params.sensorID) {
                            data.response.payload = api.db.get(id, function (error, result) {
                                if (error) {
                                    next(error);
                                } else {
                                    data.response.payload = result;
                                    next(null);
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};