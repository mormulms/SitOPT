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
  deleteOwner: deleteOwner
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
    var document = req.swagger.params.body.value;
    console.log(document)
    db.collection('Agents').find({name: document.name}).count(function (error, count) {
        if (count == 0) {
            db.collection('Agents').insertOne({
                "objecttype": "Agent",
                "location": document.location,
                "name": document.name,
                "state": document.state,
                "timestamp": (new Date).getTime()

            }, function (err, result) {
                assert.equal(err, null);
                //console.log(result);
                res.json({"message":"created"});
            });
        } else {
            res.statusCode = 404;
            res.json({message: "Already exists"});
        }
    });
}

function deleteOwner(req, res) {
    db.collection('Agents').deleteOne({name: req.swagger.params.name.value}, function (err, answer) {
        if (answer.result.n == answer.result.ok && answer.result.n == 1) {
            res.json({message: "deleted"});
        } else {
            res.statusCode = 400;
            res.json({message: "Element not found"});
        }
    });
}



