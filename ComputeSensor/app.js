var os  = require('os-utils');

var express = require('express');
var app = express();

app.get('/memoryusage/', function(req, res) {
  res.type('text/plain');
	var memoryUsage = os.freemem();
    res.send(memoryUsage.toString());
});

app.get('/cpuusage/', function(req, res) {
  res.type('text/plain');
  os.cpuFree(function(value) {
	res.send(((1-value)*100).toString());
 });
});

app.get('/ping/', function(req, res) {
  res.type('text/plain');
  res.send(true);
});

app.listen(process.env.PORT || 8080);