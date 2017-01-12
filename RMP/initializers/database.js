module.exports = {
    loadPriority:  1000,
    startPriority: 1001,
    stopPriority:  1000,
    initialize: function(api, next){
        next();
    },
    start: function(api, next){

    	//Setup mongoose for MongoDB database access (RBS - from config file /RMP/config/database.config.js)
        var mongoose = require('mongoose');
        var config = require('../config/database.config.js');
        var url = "mongodb://" + config.user + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.name;
        mongoose.connect(url);
        api.database = mongoose.connection;

        api.database.on('error', function(error) {
            console.log(error);
        });

        //Successful connection -> Creation of mongoose schema (obligatory) for sensor data 
        api.database.once('open', function(callback) {
            var cacheSchema = new mongoose.Schema({
                objectID: String,
                sensorID: String,
                value: String,
                timeStamp: Number,
                quality: Number,
                sensorQuality: Number
            });

           	//RBS contains "table" sensorCache that uses schema "cacheSchema"
            api.sensorCache = mongoose.model('Cache', cacheSchema);

            // Creation of mongoose schema (obligatory) for sensors
            var sensorSchema = new mongoose.Schema({
                objectID: String,
                sensorID: String,
                sensorUrl: String,
                timestamp: Date,
                quality: Number,
                sensorType: String,
                unit: String,
                unitSymbol: String,
                defaultValue: { type: String, default: '' },
                defaultValueActive: { type: Boolean, default: false}
            });

            //RBS contains "table" sensor that uses schema "sensorSchema"
            //Definition of "api.sensor"
            api.sensor = mongoose.model('Sensor', sensorSchema);
        });
        next();
    },
    stop: function(api, next){
        next();
    }
};
