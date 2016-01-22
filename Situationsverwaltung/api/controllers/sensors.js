
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var assert = require('assert');

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
	console.log(req.swagger.params.ID.value);

	removeDocument(req.swagger.params.ID.value, function() {
	    res.json("Deleted");
	});
}
function removeDocument(id, callback) {
   db.collection('Sensors').deleteOne(
      { "_id": new require('mongodb').ObjectID(id) },
      function(err, results) {
         callback();
      }
   );
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
//getSensorByID
//
//Returns document of specified sensor
//Returns 404 if sensor is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getSensorByID(req, res) {
	
	queryID(req.swagger.params.ID.value, function(doc){
		res.json(doc[0]);
	})
}
function queryID(id, callback){
	var array = [];
	var cursor = db.collection('Sensors').find({"_id": new require('mongodb').ObjectID(id)});
	cursor.each(function(err, doc) {
      	assert.equal(err, null);
      	if (doc != null) {
         	array.push(doc);
      	}else{
      		callback(array);
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
	queryName(req.swagger.params.name.value, function(array){
		res.json(array);
	});
}
function queryName(name, callback){
	var array = [];
	var cursor = db.collection('Sensors').find( { "name": name  } );
   	cursor.each(function(err, doc) {
      	assert.equal(err, null);
      	if (doc != null) {
         	array.push(doc);
      	}else{
      		callback(array);
      	}
   	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//allSensors
//
//Returns array of all sensors
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allSensors(req, res) {
	getAllSensors(function(allSensors) {
	    res.json(allSensors);
	});
}
function getAllSensors(callback) {
   var cursor =db.collection('Sensors').find( );
   var array = [];
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         array.push(doc);
      } else {
         callback(array);
      }
   });
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
//saveSensor
//
//Stores sensor in CouchDB
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveSensor(req, res){
	insertDocument(req.body, function() {
	    res.json("Created");
	});
}
function insertDocument(document, callback) {
   db.collection('Sensors').insertOne( {
      "ObjectType" : "Sensor",
      "SensorType" : document.sensortype,
      "name" : document.name,
      "url" : document.url,
      "quality" : document.quality,
      "description" : document.description,
      "timestamp" : (new Date).getTime()
   }, function(err, result) {
    assert.equal(err, null);
    //console.log(result);
    callback(result);
  });
};


