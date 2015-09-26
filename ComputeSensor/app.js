var os  = require('os-utils');

var express = require('express');
var app = express();

app.get('/rmp/sensordata/:objectId/:sensorId', function(req, res) {
    var sensor = req.params.sensorId;
    var objectId = req.params.objectId;
    res.type('text/plain');
    switch (sensor) {
        case 'memorySensor':
            var memoryUsage = os.freemem();
            memoryUsage /= os.totalmem();
            res.send('{"sensor":"' +sensor + '","objectId":"' + objectId + '", "value":"9"}');
            break;

        case 'cpuSensor':
            os.cpuFree(function(value) {
                res.send('{"sensor":"' +sensor + '","objectId":"' + objectId + '", "value":"30"}');
            });
            break;

        case 'watchdogSensor':
            res.send('{"sensor":"' +sensor + '","objectId":"' + objectId + '", "value":"200"}');
            break;
    }
});

app.listen(8080, function() {
    console.log('IT LIVES')
});
