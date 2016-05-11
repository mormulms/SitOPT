var os  = require('os-utils');

var express = require('express');
var app = express();

app.get('/rmp/sensordata/PC/memorySensor', function(req, res) {
  res.type('text/plain');
  os.cpuFree(function(value) {
  
	var memoryUsage = '{"payload": {\"timestamp\": ' + new Date().getTime() +', \"value\":' + '\"' + Math.round(12000 - os.freemem()).toString() + '\"}}';
	res.send(memoryUsage);
 });
});

app.get('/rmp/sensordata/PC/cpuSensor', function(req, res) {
  res.type('text/plain');
  os.cpuFree(function(value) {
    var cpuUsage = '{"payload": {\"timestamp\": ' + new Date().getTime() +', \"value\":' + '\"' + Math.round(((1-value)*100).toString()) + '\"}}';
	res.send(cpuUsage);
 });
});

app.listen(process.env.PORT || 1337);