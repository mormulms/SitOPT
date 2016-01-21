var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var assert = require('assert');

app.use(bodyParser());


module.exports = {
  //getActuatorByID: getActuatorByID,
  allActuators: allActuators,
  saveActuator: saveActuator,
  //getActuatorByName: getActuatorByName,
  //deleteActuatorByID: deleteActuatorByID
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
//allActuators
//
//Returns array of all Actuators
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allActuators(req, res) {
	console.log("Test");
	getAllActuators(function(allActuators) {
		//res.statusCode("200");
	    res.json(allActuators);
	});
}

function getAllActuators(callback) {

   var cursor =db.collection('Actuators').find( );
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
//saveActuator
//
//Stores Actuator in CouchDB
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveActuator(req, res){
	insertDocument(req.body, function() {
	    res.json("Created");
	});
}
function insertDocument(document, callback) {
   db.collection('Actuators').insertOne( {
      "objecttype" : "Actuator",
      "name" : document.name,
      "location" : document.location,
      "actions" : document.actions,
      "things" : document.things,
      "timestamp" : (new Date).getTime()

   }, function(err, result) {
    assert.equal(err, null);
    //console.log(result);
    callback(result);
  });
};



