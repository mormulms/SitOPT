exports.task = {
    name: 'scanWatchdogs',
    description: 'scanWatchdogs',
    frequency: 5000,
    queue: 'default',
    plugins: [],
    pluginOptions: {},

    run: function (api, params, next) {
        var http = require('http');
        var https = require('https');
        api.db.view("query/findWatchdogs", function (error, result) {
            if (error) {
                next(error);
            } else {
                result.forEach(function (key, value, id) {
                    var module = http;
                    var url = value.sensorUrl;
                    if (url.startsWith("https")) {
                        module = https;
                    }
                    var splits = url.split("/");
                    var hostPort = splits[2];
                    if (!url.startsWith("http")) {
                        hostPort = splits[0];
                    }
                    splits = hostPort.split(":");
                    var options = {
                        path: url.substr(url.indexOf(hostPort) + hostPort.length),
                        host: splits[0],
                        method: 'GET'
                    };
                    if (splits.length == 2) {
                        options.port = splits[1];
                    }
                    var request = module.request(options, function (res) {
                        api.valuesDb.save({
                            sensor: id,
                            sensorUrl: value.sensorUrl,
                            value: res.statusCode,
                            timestamp: new Date(),
                            quality: 1,
                            sensorquality: 1
                        }, function () {
                            next();
                        });
                    });
                    request.end();
                    request.on('error', function (err) {
                        api.log(err);
                        api.valuesDb.save({
                            sensor: id,
                            sensorUrl: value.sensorUrl,
                            value: 500,
                            timestamp: new Date(),
                            quality: 1,
                            sensorquality: 1
                        }, function () {
                            next();
                        });
                    })
                })
            }
        });
    }
}
