
var express = require('express');
var app = express();
var cradle = require('cradle');
var bodyParser = require('body-parser');

//create connection to CouchDB (default = localhost:5984)
var conn = new(cradle.Connection);
var database = conn.database('sensors');

app.use(bodyParser());


//exporting modules to swagger editor
module.exports = {
  getSensorByID: getSensorByID,
  allSensors: allSensors,
  saveSensor: saveSensor,
  getSensorByName: getSensorByName,
  deleteSensorByID: deleteSensorByID
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteSensorByID
//
//Deletes specified sensor
//Returns 404 if situation is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteSensorByID(req, res){
	var id = req.swagger.params.ID.value;
	database.remove(id, function(err,doc){
		if (err){
			res.statusCode = 404;
			res.json("Not found");
		}else{
			res.statusCode = 200;
			res.json("Sensor with ID: '" + id +"' deleted")
		}
	});
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
//getSensorByID
//
//Returns document of specified sensor
//Returns 404 if sensor is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getSensorByID(req, res) {
	
	var id = req.swagger.params.ID.value;
	console.log(id);
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
//getSensorByname
//
//Returns array of documents filtered by name
//Returns 404 if sensor is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getSensorByName(req, res) {
	var array = [];
	database.view('sensors/byName', { key: req.swagger.params.name.value }, function (err, doc) {
		if (doc != "[]"){
			for (i = 0; i < doc.length; i++){
				array.push(doc[i].value);
			}
			res.statusCode = 200;
			res.json(array);
		}else{
			res.statusCode = 404;
			res.json("Not found");
		}
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//allSensors
//
//Returns array of all sensors
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allSensors(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var array = [];
	database.view('sensors/all', { key: null }, function (err, doc) {	
		for (var i = 0; i < doc.length; i++){
			array.push(doc[i].value);
		}
		res.json(array);	
	});
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
//checkID
//
//checks metadata of document to check if ID exists
//faster than to query the complete document
/////////////////////////////////////////////////////////////////////////////////////////////////////
function checkID(documentID, databaseID , callback){
	database.head(documentID, function(err, opt1, opt2){ 
		if(opt2!='404') {				
			callback(true);
		}else{
			
			callback(false);
		}
	})
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//saveSensor
//
//Stores sensor in CouchDB
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveSensor(req, res){
	console.log("ID: "+req.body.id);
	var startTime = new Date().getTime();
	//check if referenced _id of thing exists
	if (req.body.name&&req.body.url&&req.body.quality!=-1
	&&req.body.description){
		if (req.body.id){
			database.save(req.body.id,{
				name: req.body.name,
				url: req.body.url,
				quality: req.body.quality,
				thing: req.body.thing,
				description: req.body.description
			}, function (err, response) {
				if (err) {
					res.statusCode = 504;
					res.json("Error");
				} else {
					res.statusCode = 201;
					res.json("Created");
				}
			});
		}else{
			database.save({
				name: req.body.name,
				url: req.body.url,
				quality: req.body.quality,
				thing: req.body.thing,
				description: req.body.description
			}, function (err, response) {
				if (err) {
					res.statusCode = 504;
					res.json("Error");
				} else {
					res.statusCode = 201;
					res.json("Created");
				}
			});
		}
		
	}else{
		console.log("not test");
		res.statusCode = 400;
		res.json("Missing JSON attributes");
	}	
}