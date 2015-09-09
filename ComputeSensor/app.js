var os  = require('os-utils');

var express = require('express');
var app = express();

app.get('/rmp/sensordata/:objectId/:sensorId', function(req, res) {
    var sensor = req.params.sensorId;
    var objectId = req.params.objectId;
    res.type('text/plain');
    switch (sensor) {
        case "memorySensor":
            var memoryUsage = os.freemem();
            memoryUsage /= os.totalmem();
            res.send((9).toString());
            break;

        case "cpuSensor":
            os.cpuFree(function(value) {
                res.send((71).toString())
            });
            break;

        case "watchdogSensor":
            res.sendStatus(404);
            break;
    }
});

app.listen(8080, function() {
    console.log("IT LIVES")
});