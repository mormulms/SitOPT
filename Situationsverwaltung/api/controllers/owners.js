var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var assert = require('assert');

app.use(bodyParser());


module.exports = {
  //getAgentByID: getAgentByID,
  allOwners: allOwners,
  saveOwner: saveOwner,
  //getAgentByName: getAgentByName,
  //deleteAgentByID: deleteAgentByID
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
//allOwners
//
//Returns array of all Agents
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allOwners(req, res) {
	console.log("Test");
	getAllOwners(function(allAgents) {
		//res.statusCode("200");
	    res.json(allAgents);
	});
}

function getAllOwners(callback) {

   var cursor =db.collection('Agents').find( );
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
//saveOwner
//
//Stores Agent in CouchDB
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveOwner(req, res){
	insertDocument(req.body, function() {
	    res.json({"message":"created"});
	});
}
function insertDocument(document, callback) {
   db.collection('Agents').insertOne( {
      "objecttype" : "Agent",
      "location" : document.location,
      "name" : document.name,
      "state": document.state,
      "timestamp" : (new Date).getTime()

   }, function(err, result) {
    assert.equal(err, null);
    //console.log(result);
    callback(result);
  });
};



