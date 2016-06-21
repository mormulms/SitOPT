
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var assert = require('assert');

app.use(bodyParser());



//exporting modules to swagger editor
module.exports = {
  allSensors: allSensors,
  saveSensor: saveSensor,
  getSensorByName: getSensorByName,
  deleteSensor: deleteSensor
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteSensorByID
//
//Deletes specified sensor
//Returns 404 if situation is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteSensor(req, res){
	removeDocument(req.swagger.params.name.value, function(items) {
		if (items.deletedCount > 0) {
			res.json({name: "Deleted"});
		} else {
			res.statusCode = 404;
			res.json({message: "Not Found"});
		}
	});
}
function removeDocument(id, callback) {
   db.collection('Sensors').deleteOne(
      { "name": id },
      function(err, results) {
         callback(results);
      }
   );
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//getSensorByname
//
//Returns array of documents filtered by name
//Returns 404 if sensor is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getSensorByName(req, res) {
	queryName(req.swagger.params.name.value, function(array){
		if (array.length > 0) {
			res.json(array[0]);
		} else {
			res.statusCode = 404;
			res.json({message: "Not Found"})
		}
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
	var document = req.swagger.params.body.value;
	queryName(document.name, function (array) {
		if (array.length == 0) {
			db.collection('Sensors').insertOne({
				"ObjectType": "Sensor",
				"SensorType": document.SensorType,
				"name": document.name,
				"url": document.url,
				"quality": document.quality,
				"description": document.description,
				"timestamp": (new Date).getTime()
			}, function (err, result) {
				assert.equal(err, null);
				//console.log(result);
				res.json({message: JSON.stringify(result)});
			});
		} else {
			res.statusCode = 400;
			res.json({message: 'name already exists'});
		}
	});
}


