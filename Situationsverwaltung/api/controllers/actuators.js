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
    deleteActuator: deleteActuator
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
        console.log(allActuators);
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
    var document = req.swagger.params.body.value;
    db.collection('Actuators').find({name: document.name}).count(function (err, count) {
        if (count == 0) {
            db.collection('Actuators').insertOne({
                "objecttype": "Actuator",
                "name": document.name,
                "location": document.location,
                "actions": document.actions,
                "things": document.things,
                "timestamp": (new Date).getTime()

            }, function (err, result) {
                assert.equal(err, null);
                //console.log(result);
                res.json({message: "Created"});
            });
        } else {
            res.statusCode = 400;
            res.json({message: "Name already exists"});
        }
    });
}

function deleteActuator(req, res) {
    db.collection('Actuators').deleteOne({name: req.swagger.params.name.value}, function (err, answer) {
        if (answer.result.n == answer.result.ok && answer.result.n == 1) {
            res.json({message: "deleted"});
        } else {
            res.statusCode = 400;
            res.json({message: "Element not found"});
        }
    });
}



