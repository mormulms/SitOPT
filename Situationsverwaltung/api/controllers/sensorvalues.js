
var express = require('express');
var app = express();
var cradle = require('cradle');
var bodyParser = require('body-parser');

//create connection to CouchDB (default = localhost:5984)
var conn = new(cradle.Connection);
var database = conn.database('sensorvalues');


app.use(bodyParser());


//exporting modules to swagger editor
module.exports = {
  sensorvalueByID: sensorvalueByID,
  allSensorvalues: allSensorvalues,
  saveSensorvalue: saveSensorvalue,
};

//sensorvalueByID
//
//Query CouchDB document by ID
function sensorvalueByID(req, res) {
	var id = req.swagger.params.ID.value;
	database.get(id, function (err, doc) {	
		if (err) {
			res.statusCode = 404;
			res.json("Not found");
		} else {
			res.statusCode = 200;
			res.json(doc);
		}	
	});	
}

//allSensorvalues
//
//Queries CouchDB view "all" and returns array with all sensorvalues
function allSensorvalues(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var array = [];
	database.view('sensorvalues/all', { key: null }, function (err, doc) {	
		for (var i = 0; i < doc.length; i++){
			array.push(doc[i].value);
		}
		res.json(array);	
	});
}

//checkID
//
//checks metadata of document to check if ID exists
//faster than to query the complete document
function checkID(documentID, databaseID , callback){
	var datab = conn.database(databaseID);
	datab.head(documentID, function(err, opt1, opt2){ 
		if(opt2!='404') {				
			callback(true);
		}else{
			
			callback(false);
		}
	})
}



//saveSensorvalue
//
//IMPLEMENTED FOR TESTING PURPOSE ONLY
//sensorvalues are exclusively stored by storing situation objects.
function saveSensorvalue(req, res){
	var startTime = new Date().getTime();
	//check if referenced _id of thing exists
	checkID(req.body.sensor, 'sensors', function(sensorExists){	
		if(!sensorExists){
			res.statusCode = 404;
			res.json("Reference error: Sensor not found");
		}else{
			//call view to check if sensor value already exists
			database.view('sensorvalues/existing', { key: req.body.sensor}, function (err, doc) {

				//array not empty -> sensor value already exists -> use existing document id to save sensor value
				if (doc != "[]"){
					database.save(doc[0].id,{
						sensor: req.body.sensor,
						value: req.body.value,
						timestamp: req.body.timestamp,
						quality: req.body.quality,
						sensorquality: req.body.sensorquality
							
					}, function (err, response) {
						if (err) {
							res.statusCode = 504;
							res.json("Error");
						}else {
							res.statusCode = 200;
							res.json("Updated");
						}
					});
				//array is empty. Passing no _id results in CouchDB creating one
				}else{
					database.save({
						sensor: req.body.sensor,
						value: req.body.value,
						timestamp: req.body.timestamp,
						quality: req.body.quality,
						sensorquality: req.body.sensorquality
						
					}, function (err, response) {
						if (err) {
							res.statusCode = 504;
							res.json("Error");
						}else {
							res.statusCode = 201;
							res.json("Created");
						}
					});
				}
			})
		}
	});
}