exports.action = {
    name:                   'deleteSensor',
    description:            'deleteSensor',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        objectID: {required: true},
        sensorID: {required: true}
    },

    run: function(api, data, next){
        api.db.view('query/findByObject', {key: data.params.objectID}, function(error, result) {
            if (error) {
                next(error);
            } else {
                if (result.length == 0) {
                    next('resource not found');
                } else {
                    result.forEach(function (key, row, id) {
                        if (row == data.params.sensorID) {
                            api.db.remove(id, function (err, res) {
                                if (err) {
                                    next(err);
                                } else {
                                    data.response.payload = res;
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