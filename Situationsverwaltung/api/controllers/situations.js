'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var assert = require('assert');

var httpSend = require('request');






app.use(bodyParser());


//exporting modules to swagger editor
module.exports = {
  situationByID: situationByID,
  allSituations: allSituations,
  saveSituation: saveSituation,
  situationByName: situationByName,
  situationByThingAndTemplate: situationByThingAndTemplate,
  situationChange: situationChange,
  situationChangeDelete: situationChangeDelete,
  situationOccured: situationOccured,
  deleteSituationByID: deleteSituationByID,
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
			res.json("No registrations");
		}else{
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
			res.json("No registrations found for this URL");
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
	var id = req.swagger.params.ID.value;
	if (!req.swagger.params.ID.value){
		//Change all situations			
	}else{
		/*bucket.get(id, function (err, doc) {
			console.log(doc);
			if (err) {
				res.statusCode = 404;
				res.json("Not found");
			} else {
				res.statusCode = 200;
				res.json ("OK");
				bucket.upsert(req.body.id,
					{thing: doc.thing,
					timestamp: doc.timestamp,
					situationtemplate: doc.situationtemplate,
					occured: !doc.occured,
					name: doc.name,
					quality: doc.quality,
					sensorvalues: doc.sensorvalues
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
		});	*/
		res.json("not implemented");
		
	}
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
	
	res.json("Registration deleted");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//situationChange
//
//Enables registration to situation changes specified by ThingID and TemplateID
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationChange(req, res){

	//XOR not allowerd
	if (!(req.swagger.params.SitTempID.value==undefined)&&req.swagger.params.ThingID.value==undefined || 
		req.swagger.params.SitTempID.value==undefined&&!(req.swagger.params.ThingID.value==undefined)){
		res.statusCode = 400;
		res.json("Specify both IDs or none.");
		console.log("Case1");
	//Registration for all situations
	} else if (req.swagger.params.SitTempID.value==undefined&&req.swagger.params.ThingID.value==undefined){
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
			res.json("Registration successful");	
		}else{
			res.statusCode = 200;
			res.json("Previous registration deleted. New registration successful");
		}
	//Registration for specified situation
	}else{
		queryThingAndTemplate(req.swagger.params.ThingID.value, 
		req.swagger.params.SitTempID.value, function(doc){

			if (doc[0] == null){
				res.statusCode = 404;
				res.json("File not found");
			}else{
				var registrated = false;
				for (var i = 0; i < callbackArray.length; i++){
					if ((callbackArray[i].callbackURL == req.swagger.params.CallbackURL.value && callbackArray[i].ThingID == doc[0].thing && callbackArray[i].TemplateID == doc[0].situationtemplate) ||
						(callbackArray[i].callbackURL == req.swagger.params.CallbackURL.value && callbackArray[i].ThingID == "")){
						registrated = true;
					}
				}	
				if (!registrated){
					console.log(doc[0].thing);
					SaveURL(doc[0].thing, doc[0].situationtemplate, req.swagger.params.CallbackURL.value, req.swagger.params.once.value);
					res.statusCode = 200;
					res.json("Registration successful");
				}else{
					res.statusCode = 400;
					res.json("Already registered");
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
function deleteSituationByID(req, res){

	removeDocument(req.swagger.params.ID.value, function() {
	    res.json("Deleted");
	});
}
function removeDocument(id, callback) {
   db.collection('Situations').deleteOne(
      { "_id": new require('mongodb').ObjectID(id) },
      function(err, results) {
         callback();
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
		req.swagger.params.situationtemplate.value, function(array){
		res.json(array);
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
//situationByID
//
//Returns document of specified situation
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationByID(req, res) {
	queryID(req.swagger.params.ID.value, function(doc){
		res.json(doc[0]);
	})
}
function queryID(id, callback){
	var array = [];
	var cursor = db.collection('Situations').find({"_id": new require('mongodb').ObjectID(id)});
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
		var tuple = { sensor : document.sensorvalues[i].value};
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
      "name" : template.situation,
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
		var tuple = { sensor : document.sensorvalues[i].value};
		sensorvalues.push(tuple);
	}
   	db.collection('Situations').updateOne( 
   		{"_id" :  new require('mongodb').ObjectID(oldDoc._id) },
   		{
   			$set: { "thing" : document.thing,
			      "timestamp" : document.timestamp,
			      "situationtemplate" : document.situationtemplate,
			      "occured" : document.occured,
			      "name" : template.situation,
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
	queryThingID(req.body.thing, function(thing){
		if(thing[0] == null){
			res.json("Reference error: Thing not found");
		}else{
			queryTemplateID(req.body.situationtemplate, function(template){
				if (template[0] == null){
					res.json("Reference Error: Situationtemplate not found");
				}else{
					queryThingAndTemplate(req.body.thing,
						req.body.situationtemplate, function(doc){
							//console.log(doc);
						if (doc[0] == null){
							insertDocument(req.body,template[0], function() {
								checkCallbacks(req.body);
							    res.json("Created");
							});
						}else{
							if (doc[0].occured != req.body.occured){
								checkCallbacks(req.body);
								updateDocument(req.body,doc[0], template[0], function(){
									res.json("Updated");
								});
							}else{
								res.json("No Update");

							}	
						}
					});
				}
			});
		}
	});
}









//for testing purposes only
process.on('SIGINT', function () {
    console.log(timeArray);
    console.log(counter);
    process.exit(2);
});