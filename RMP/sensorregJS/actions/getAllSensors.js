exports.action = {
    name:                   'getAllSensors',
    description:            'getAllSensors',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {},

    run: function(api, data, next){
        var async = require('async');
        var elements = [];
        api.db.view('query/all', function(error, result) {
            if (error) {
                next(error);
            } else {
                async.waterfall(
                    result.forEach(function (key, row) {
                        elements.push(key);
                    }),
                    function() {
                        console.log(elements.length);
                        data.response.payload = elements;
                        next(null);
                    }
                );
            }
        })
    }
};