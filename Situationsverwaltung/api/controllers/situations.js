'use strict';

var express = require('express');
var app = express();
var cradle = require('cradle');
var bodyParser = require('body-parser');

var httpSend = require('request');
//create connection to CouchDB (default = localhost:5984)
var conn = new(cradle.Connection);
var database = conn.database('situations');


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
  deleteSituationByID: deleteSituationByID
};

var callbackArray = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////
//feed
//
//registrate to CouchDB _changes resource
//if changes occur, call checkCallbacks()
/////////////////////////////////////////////////////////////////////////////////////////////////////
var feed = database.changes({ 'include\_docs' : true, since: 'now'});
feed.on('change', function (change) {	  
	//transformations to enable access to JSON attributes
	var stringifiedChange = JSON.stringify(change);
	var JSONchange = JSON.parse(stringifiedChange);
	//Don't recognize views or deletion of situations as events
	if (!(JSONchange.doc._deleted == true) && !(JSONchange.doc._id == "_design/situations")){
		checkCallbacks(JSONchange.doc);
	}	 
});

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
	for (var i=0; i<callbackArray.length;i++){
		
		if (callbackArray[i].id == document._id || callbackArray[i].id == ""){
			callbacks.push(i);	
		}
	}
	for (var i=callbacks.length-1; i>=0;i--){
		console.log(callbackArray[callbacks[i]].callbackURL);
		
		httpSend.post(

			callbackArray[callbacks[i]].callbackURL,
			{ form: { doc: document}},
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body)
				}
			}
		);	
		if (callbackArray[callbacks[i]].once){
			callbackArray.remove([callbacks[i]]);
			console.log("deleted");
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

	if (!req.swagger.params.ID.value){
		//Change all situations			
	}else{
		database.get(req.swagger.params.ID.value, function (err, doc) {	
			if (err) {
				res.statusCode = 404;
				res.json("Not found");
			} else {
				res.statusCode = 200;

				database.save(doc._id,{
					thing: doc.thing,
					timestamp: doc.timestamp,
					situationtemplate: doc.situationtemplate,
					occured: !doc.occured,
					name: doc.name,
					quality: doc.quality,
					sensorvalues: doc.sensorvalues
				});
				res.json("Document updated");
			}	
		});	
		
	}
}



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

	if (!(req.swagger.params.SitTempID.value==undefined)&&req.swagger.params.ThingID.value==undefined || 
		req.swagger.params.SitTempID.value==undefined&&!(req.swagger.params.ThingID.value==undefined)){
		//fehlerhaft
		res.status(404);
		res.json("Specify both IDs or none.");

	//registration to all situation changes
	} else if (req.swagger.params.SitTempID.value==undefined&&req.swagger.params.ThingID.value==undefined){
		res.statusCode = 200;
		res.json("Registration successful");
		var id = "";
		SaveURL(id, 'situations', req.swagger.params.CallbackURL.value,
			req.swagger.params.once.value);

	//registration to a specific situation, specified by ThingID and TemplateID
	}else{
		database.view('situations/existing', { key: [req.swagger.params.ThingID.value, req.swagger.params.SitTempID.value] }, function (err, doc) {
		//if array not empty (_id exists), pass the existing _id for the situation to update a document
			console.log(doc);
			if (doc == "[]"){
				res.statusCode = 404;
				res.json("File not found");
			}else{
				SaveURL(doc[0].id, 'situations', req.swagger.params.CallbackURL.value,
						req.swagger.params.once.value);
				res.statusCode = 200;
				res.json("Registration successful");
			}
		});
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//SaveURL
//
//Stores registration in array "callbackArray"
/////////////////////////////////////////////////////////////////////////////////////////////////////
function SaveURL(documentID, database, url, continued){
	var tuple = {id : documentID, db : database, callbackURL: url, once : continued};
    callbackArray.push(tuple);
}






/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteSituationByID
//
//Deletes specified situation
//Returns 404 if situation is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteSituationByID(req, res){

	var id = req.swagger.params.ID.value;
	database.remove(id, function(err,doc){
		if (err){
			res.statusCode = 404;
			res.json("Not found");
		}else{
			res.statusCode = 200;
			res.json("Situation with ID: '" + id +"' deleted")
		}
	});
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
//situationByName
//
//Returns an array with situations filtered by name
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationByName(req, res){
	var array = [];
	database.view('situations/byName', { key: req.swagger.params.name.value }, function (err, doc) {
		console.log("Length of array: " + doc.length);
		
		for (var i = 0; i < doc.length; i++){
			array.push(doc[i].value);
		}
		if (array.length == 0){
			res.statusCode = 404;
			res.json("Not found");
		}else{
			res.json(array);
		}	
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//situationByThingAndTemplate
//
//Returns situation identified by thingID and situationtemplateID
/////////////////////////////////////////////////////////////////////////////////////////////////////
function situationByThingAndTemplate(req, res){
	database.view('situations/byThingAndTemplate', 
	{ key: [req.swagger.params.thing.value, 
			req.swagger.params.situationtemplate.value] }, function (err, doc) {
		
		if (doc.length == 0){
			res.statusCode = 404;
			res.json("Not found");
		}else{
			res.json(doc[0].value);
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
	var id = req.swagger.params.ID.value;
	database.get(id, function (err, doc) {	
		if (err) {
			res.statusCode = 404;
			res.json("Not found");
		} else {
			res.statusCode = 200;	
			var stringifiedChange = JSON.stringify(doc);
			var JSONchange = JSON.parse(stringifiedChange);
			res.json(doc);
		}	
	});	
	
	
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//allSituations
//
//Returns array with all situations
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allSituations(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var array = [];
	database.view('situations/all', { key: null }, function (err, doc) {
		for (var i = 0; i < doc.length; i++){
			array.push(doc[i].value);
		}	
		res.json(array);
		
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//saveSVs
//
//Store sensor values of situations and return their IDs
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveSVs(sensorValueArray,index,sensorValueIDs, callback){
	var db = conn.database('sensorvalues');
	db.view('sensorvalues/existing', { key: sensorValueArray[index].sensor}, function (err, doc) {
		if (doc != "[]"){
			db.save(doc[0].id,{
				sensor: sensorValueArray[index].sensor,
				value: sensorValueArray[index].value,
				timestamp: sensorValueArray[index].timestamp,
				quality: sensorValueArray[index].sensorquality
		
			}, function (err, response) {
				if (err) {	  
				}else {	
					sensorValueIDs.push(response.id);
				    if(index != sensorValueArray.length-1){
						saveSVs(sensorValueArray, index + 1, sensorValueIDs, function(array){
							callback(array);
						});
					}else{				
						callback(sensorValueIDs);
					}
				}
			});
		//array is empty. Passing no _id results in CouchDB creating one
		}else{
			db.save({		
				sensor: sensorValueArray[index].sensor,
				value: sensorValueArray[index].value,
				timestamp: sensorValueArray[index].timestamp,
				quality: sensorValueArray[index].sensorquality
				
			}, function (err, response) {
				if (err) {
					
				}else {
					sensorValueIDs.push(response.id);
					
					if(index != sensorValueArray.length-1){
						saveSVs(sensorValueArray, index + 1, sensorValueIDs, function(array){
							callback(array);
						});
					}else{
						callback(sensorValueIDs);
					}
				}
			});
		}
	});
}

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

/////////////////////////////////////////////////////////////////////////////////////////////////////
//checkID
//
//checks metadata of document to check if ID exists
//faster than to query the complete document
/////////////////////////////////////////////////////////////////////////////////////////////////////
function checkID(documentID, databaseID , callback){
	var db = conn.database(databaseID);
	db.head(documentID, function(err, opt1, opt2){ 
		if(opt2!='404') {				
			callback(true);
		}else{
			
			callback(false);
		}
	})
}

//for testing purposes only
var timeArray = [];
var counter = 0;


/////////////////////////////////////////////////////////////////////////////////////////////////////
//saveSituation
//
//Stores a situation in CouchDB
//Returns 404 if thing or situation template are not found
//Returns 504 if CouchDB does not respond
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveSituation(req, res){

	//for testing purpose only
	var nodeREDtime = new Date(req.body.timestamp);
	var startTime = new Date(); //.getTime();

	var sitTempDatabase = conn.database('situationtemplates');
	//check if referenced id of thing exists
	checkID(req.body.thing, 'things', function(thingExists){	
		if(!thingExists){
			res.statusCode = 404;
			res.json("Reference error: thing not found");
		}else{
			//get situation template for metadata (name of situation)
			sitTempDatabase.get(req.body.situationtemplate, function (err, template) {	
				if (err) {
					res.statusCode = 404;
					res.json("Not found");
				}else{
					//Set thing.monitored to true
					startThingMonitoring(req.body.thing);
					//Store sensor values of situations. saveSVs returns list of IDs of sensor values to reference them in the situation
					saveSVs(req.body.sensorvalues, 0,[], function(sensorValues){
						
						//call view to check if the situation already exists (combination of thing._id & situationtemplate._id)
						database.view('situations/existing', { key: [req.body.thing, req.body.situationtemplate] }, function (err, doc) {
							//if array not empty (_id exists), pass the existing _id for the situation to update a document
							if (doc != "[]"){
								//check if occured-attribute changed (should be set by user when starting situation recognition)
								if (doc[0].value.occured!= req.body.occured){

									database.save(doc[0].id,{
									thing: req.body.thing,
									timestamp: req.body.timestamp,
									situationtemplate: req.body.situationtemplate,
									occured: req.body.occured,
									name: template.situation,
									quality: 1,
									sensorvalues: sensorValues
										
									}, function (err, response) {
										if (err) {
											res.statusCode = 504;
											res.json("Error");
										}else {
											res.statusCode = 200;


											//for testing purpose only
											var endTime = new Date().getTime();
											var diff = endTime-startTime;
											var nodeDiff = endTime-nodeREDtime;
											var time = {timeNodeRed: nodeDiff, timeSitVer: diff, transferTime: startTime-nodeREDtime};
											timeArray.push(time);
											counter++;


											res.json("Updated");
										}
									});
								}
								
							//array is empty. Passing no _id results in CouchDB creating one
							}else{
								database.save({
									thing: req.body.thing,
									timestamp: req.body.timestamp,
									situationtemplate: req.body.situationtemplate,
									occured: req.body.occured,
									name: template.situation,
									quality: 1,
									sensorvalues: sensorValues
									
									
								}, function (err, response) {
									if (err) {
										res.statusCode = 504;
										res.json("Error");
									}else {
										res.statusCode = 201;

										//for testing purpose only
										var endTime = new Date().getTime();
										var diff = endTime-startTime;
										var nodeDiff = endTime-nodeREDtime;
										var time = {timeNodeRed: nodeDiff, timeSitVer: diff, transferTime: startTime-nodeREDtime};
										timeArray.push(time);
										counter++;


										res.json("Created");

									}
								});
							}					
						});
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