'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var assert = require('assert');

var httpSend = require('request');






app.use(bodyParser());


//exporting modules to swagger editor
module.exports = {
	allSituations: allSituations,
	saveSituation: saveSituation,
	situationByName: situationByName,
	situationByThingAndTemplate: situationByThingAndTemplate,
	situationChange: situationChange,
	situationChangeDelete: situationChangeDelete,
	situationOccured: situationOccured,
	deleteSituation: deleteSituation,
	allRegistrations: allRegistrations
};

var callbackArray = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////
//feed
//
//registrate to CouchDB _changes resource
//if changes occur, call checkCallbacks()
/////////////////////////////////////////////////////////////////////////////////////////////////////
/*var feed = database.changes({ 'include\_docs' : true, since: 'now'});
 feed.on('change', function (change) {
 //transformations to enable access to JSON attributes
 var stringifiedChange = JSON.stringify(change);
 var JSONchange = JSON.parse(stringifiedChange);
 //Don't recognize views or deletion of situations as events
 if (!(JSONchange.doc._deleted == true) && !(JSONchange.doc._id == "_design/situations")){
 checkCallbacks(JSONchange.doc);
 }
 });
 */

Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};



/////////////////////////////////////////////////////////////////////////////////////////////////////
//checkCallbacks
//
//Checks if there are registrations available on changed situations
//Sends document to stored Callback URL
//Deletes registrations if attribute "once" is set "true"
/////////////////////////////////////////////////////////////////////////////////////////////////////
function checkCallbacks(document){
	var callbacks = [];
	console.log(document);
	for (var i=0; i<callbackArray.length;i++){

		console.log("----------");
		console.log("DOCUMENT");
		console.log(callbackArray[i]);
		console.log("----------");
		console.log(callbackArray[i].ThingID);
		console.log(document.thing);
		console.log(callbackArray[i].TemplateID);
		console.log(document.situationtemplate);
		console.log("----------");
		if ((callbackArray[i].ThingID == document.thing && callbackArray[i].TemplateID == document.situationtemplate)
			|| callbackArray[i].ThingID == ""){
			callbacks.push(i);
		}
	}
	//console.log(callbacks.length);
	for (var i=callbacks.length-1; i>=0;i--){
		console.log("Test" + callbackArray[callbacks[i]].callbackURL);

		var JSON = {doc: document};
		httpSend({
			url: callbackArray[callbacks[i]].callbackURL,
			method: "POST",
			json: true,
			body: document
		}, function(error, response, body){
			if (!error && response.statusCode == 200){
				console.log(body);
			}
		})

		if (callbackArray[callbacks[i]].once){
			callbackArray.remove([callbacks[i]]);
			console.log("deleted");
		}
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
//allRegistrations
//
//Returns all registrations by the Situation Handler
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allRegistrations(req, res){
	if (req.swagger.params.CallbackURL.value == undefined){
		res.statusCode = 200;
		if (callbackArray.length == 0){
			res.statusCode = 404;
			res.json({message: "No registrations"});
		}else{
			console.log(callbackArray)
			res.json(callbackArray);
		}

	}else{
		var URLArray = [];
		for (var i = 0; i < callbackArray.length; i++){

			if (req.swagger.params.CallbackURL.value == callbackArray[i].callbackURL){
				URLArray.push(callbackArray[i]);
			}
		}
		if(URLArray.length == 0){
			res.statusCode = 404;
			res.json({message: "No registrations found for this URL"});
		}else{
			res.statusCode = 200;
			res.json(URLArray);
		}

	}

}




/////////////////////////////////////////////////////////////////////////////////////////////////////
//situationOccured
//
//Changes the "occured"-attribute of a situation for testing purposes
//Returns 404 if situation is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationOccured(req, res){
	console.log(req.swagger.params.thing.value);
	console.log(req.swagger.params.situation.value);
	db.collection('Situations').find({thing: req.swagger.params.thing.value, situationtemplate: req.swagger.params.situation.value}, function (err, items) {
		items.count(function (e, c) {
			if (c !== 1) {
				res.statusCode = 400;
				res.json({message: "Situation not found"});
			} else {
				items.forEach(function (item) {
					item.occured = !item.occured;
					db.collection('Situations').updateOne({_id: item._id}, item);
					res.json({name: "updated"});
				});
			}
		})
	});
}
/*var updateOccured = function(db, callback) {
 db.collection('Situations').updateOne(
 { "_id": new require('mongodb').ObjectID(id) },
 {
 $set: { "occured": "American (New)" },
 $currentDate: { "lastModified": true }
 }, function(err, results) {
 console.log(results);
 callback();
 });
 };*/



/////////////////////////////////////////////////////////////////////////////////////////////////////
//situationChangeDelete
//
//Deletes registration to situation changes 
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationChangeDelete(req, res){
	for (var i=callbackArray.length-1; i >=0; i--){
		if (callbackArray[i].callbackURL == req.swagger.params.CallbackURL.value){
			if (!req.swagger.params.ID.value){
				callbackArray.remove(i);
				console.log("deleted");
			}else if (callbackArray[i].id == req.swagger.params.ID.value){
				callbackArray.remove(i);
				console.log("deleted");
			}
		}
	}

	res.json({message: "Registration deleted"});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//situationChange
//
//Enables registration to situation changes specified by ThingID and TemplateID
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationChange(req, res){

	//XOR not allowerd
	if (!(req.swagger.params.SitTempName.value==undefined)&&req.swagger.params.ThingName.value==undefined ||
		req.swagger.params.SitTempName.value==undefined&&!(req.swagger.params.ThingName.value==undefined)){
		res.statusCode = 400;
		res.json({message: "Specify both IDs or none."});
		console.log("Case1");
		//Registration for all situations
	} else if (req.swagger.params.SitTempName.value==undefined&&req.swagger.params.ThingName.value==undefined){
		console.log("Case2");


		var registrated = false;
		for (var i=callbackArray.length-1; i >=0; i--){
			if (callbackArray[i].callbackURL == req.swagger.params.CallbackURL.value){
				registrated = true;
				callbackArray.remove(i);
			}
		}

		SaveURL("", "", req.swagger.params.CallbackURL.value, req.swagger.params.once.value);

		if (!registrated){
			res.statusCode = 200;
			res.json({message: "Registration successful"});
		}else{
			res.statusCode = 200;
			res.json({message: "Previous registration deleted. New registration successful"});
		}
		//Registration for specified situation
	}else{
		queryThingAndTemplate(req.swagger.params.ThingName.value,
			req.swagger.params.SitTempName.value, function(doc){

				if (doc[0] == null){
					res.statusCode = 404;
					res.json({message: "File not found"});
				}else{
					var registrated = false;
					for (var i = 0; i < callbackArray.length; i++){
						if ((callbackArray[i].callbackURL == req.swagger.params.CallbackURL.value && callbackArray[i].ThingName == doc[0].thing && callbackArray[i].TemplateID == doc[0].situationtemplate) ||
							(callbackArray[i].callbackURL == req.swagger.params.CallbackURL.value && callbackArray[i].ThingName == "")){
							registrated = true;
						}
					}
					if (!registrated){
						console.log(doc[0].thing);
						SaveURL(doc[0].thing, doc[0].situationtemplate, req.swagger.params.CallbackURL.value, req.swagger.params.once.value);
						res.statusCode = 200;
						res.json({message: "Registration successful"});
					}else{
						res.statusCode = 400;
						res.json({message: "Already registered"});
					}

				}
			});
	}



}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//SaveURL
//
//Stores registration in array "callbackArray"
/////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveURL(thingID, templateID, url, continued){
	var tuple = {ThingID : thingID, TemplateID: templateID, callbackURL: url, once : continued};
	callbackArray.push(tuple);
}






/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteSituationByID
//
//Deletes specified situation
//Returns 404 if situation is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteSituation(req, res){

	removeDocument(req.swagger.params.thing.value, req.swagger.params.situation.value, function(err, items) {
		console.log(items)
		if (err || items.deletedCount == 0) {
			res.statusCode = 404;
			res.json({message: "Document not found"})
		} else {
			res.json({name: "Deleted"});
		}
	});
}
function removeDocument(thing, situation, callback) {
	db.collection('Situations').deleteOne(
		{ thing: thing, situationtemplate: situation },
		function(err, results) {
			callback(err, results);
		}
	);
};



/////////////////////////////////////////////////////////////////////////////////////////////////////
//situationByName
//
//Returns an array with situations filtered by name
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationByName(req, res){
	queryName(req.swagger.params.name.value, function(array){
		res.json(array);
	});
}
function queryName(name, callback){
	var array = [];
	var cursor = db.collection('Situations').find( { "name": name  } );
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
//situationByThingAndTemplate
//
//Returns situation identified by thingID and situationtemplateID
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationByThingAndTemplate(req, res){
	queryThingAndTemplate(req.swagger.params.thing.value,
		req.swagger.params.situation.value, function(array){
			if (array.length > 0) {
				var situation = array[0];
				res.json(situation);
			} else {
				res.statusCode = 400;
				res.json({message: "Element not found"});
			}
		});

}
function queryThingAndTemplate(thing, template, callback){
	var array = [];
	var cursor = db.collection('Situations').find( { "thing": thing, "situationtemplate": template } );
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
//allSituations
//
//Returns array with all situations
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allSituations(req, res) {
	getAll(function(allThings) {
		console.log(JSON.stringify(allThings))
		res.json(allThings);
	});
}
function getAll(callback) {
	var cursor =db.collection('Situations').find( );
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
//called when a situation to a specific thing is recognized
//(should be called when situation recognition starts)
/////////////////////////////////////////////////////////////////////////////////////////////////////
function startThingMonitoring(documentID){
	var db = conn.database('things');
	db.merge(documentID, {monitored: true}, function (err, res) {

	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//not used
//should be called when situation recognition stops
/////////////////////////////////////////////////////////////////////////////////////////////////////
function stopThingMonitoring(documentID){
	var db = conn.database('things');
	db.merge(documentID, {monitored: false}, function (err, res) {

	});
}


//for testing purposes only
var timeArray = [];
var counter = 0;

function queryThingID(id, callback){
	var array = [];
	var cursor = db.collection('Things').find({"_id": new require('mongodb').ObjectID(id)});
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			array.push(doc);
		}else{
			callback(array);
		}
	});
}
function queryTemplateID(id, callback){
	var array = [];
	var cursor = db.collection('Situationtemplates').find({"_id": new require('mongodb').ObjectID(id)});
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc != null) {
			array.push(doc);
		}else{
			callback(array);
		}
	});
}

function insertDocument(document,template, callback) {

	var sensorvalues = [];
	var occurence = 0;
	for (var i = 0; i < document.sensorvalues.length; i++){
		var sensor = document.sensorvalues[i].sensor;
		var timestamp = document.sensorvalues[i].timestamp || new Date().getDate();
		var tuple = { sensor : sensor, value: document.sensorvalues[i].value, timestamp: timestamp, quality: document.sensorvalues[i].quality};
		sensorvalues.push(tuple);
	}

	if (document.occured){
		occurence = 1;
	}
	db.collection('Situations').insertOne( {
		"objecttype" : "Situation",
		"thing" : document.thing,
		"timestamp" : document.timestamp,
		"situationtemplate" : document.situationtemplate,
		"occured" : document.occured,
		"name" : document.situationtemplate,
		"quality": 100,
		"sensorvalues": sensorvalues,


	}, function(err, result) {
		assert.equal(err, null);
		//console.log(result);
		callback(result);
	});
};

function updateDocument(document, oldDoc, template, callback) {
	var sensorvalues = [];
	for (var i = 0; i < document.sensorvalues.length; i++){
		var sensor = document.sensorvalues[i].sensor;
		var timestamp = document.sensorvalues[i].timestamp || new Date().getDate();
		var tuple = { sensor : sensor, value: document.sensorvalues[i].value, timestamp: timestamp, quality: document.sensorvalues[i].quality};
		sensorvalues.push(tuple);
	}
	db.collection('Situations').updateOne(
		{"_id" :  new require('mongodb').ObjectID(oldDoc._id) },
		{
			$set: {
				"timestamp" : document.timestamp,
				"occured" : document.occured,
				"quality": 100,
				"sensorvalues": sensorvalues
			}
		}, function(err, result) {
			assert.equal(err, null);
			//console.log(result);
			callback();
		});
};



/////////////////////////////////////////////////////////////////////////////////////////////////////
//saveSituation
//
//Stores a situation in CouchDB
//Returns 404 if thing or situation template are not found
//Returns 504 if CouchDB does not respond
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveSituation(req, res){
	//check if referenced id of thing exists
	queryThingAndTemplate(req.body.thing,
		req.body.situationtemplate, function(doc){
			//console.log(doc);
			if (doc[0] == null){
				insertDocument(req.body,req.body.situationtemplate, function() {
					checkCallbacks(req.body);
					res.json({message: "Created"});
				});
			}else{
				console.log(doc[0].sensorvalues);
				console.log(req.body.sensorvalues);
				if (doc[0].occured != req.body.occured || JSON.stringify(doc[0].sensorvalues) != JSON.stringify(req.body.sensorvalues)) {
					checkCallbacks(req.body);
					updateDocument(req.body,doc[0], req.body.situationtemplate, function(){
						res.json({message: "Updated"});
					});
				}else{
					res.json({message: "No Update"});
				}
			}
		});
}









//for testing purposes only
process.on('SIGINT', function () {
	console.log(timeArray);
	console.log(counter);
	process.exit(2);
});