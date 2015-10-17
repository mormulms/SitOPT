module.exports = {
    loadPriority:  1000,
    startPriority: 1002,
    stopPriority:  1000,
    initialize: function(api, next){
        api.sensorValuesDb = {};

        next();
    },
    start: function(api, next){
        var cradle = require('cradle');
        var config = require('../config/database.config.js');
        cradle.setup({
            host: config.protocol + "://" + config.host,
            port: config.port,
            auth: {
                username: config.user,
                password: config.password
            },
            options: {
                secure: false,
                cache: true,
                raw: false,
                forceSave: true
            }
        });
        var couch = new(cradle.Connection)();
        api.valuesDb = couch.database(config.valuesDatabase);
        next();
    },
    stop: function(api, next){
        next();
    }
};
