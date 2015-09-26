
var express = require('express');
var app = express();
var cradle = require('cradle');
var bodyParser = require('body-parser');

//create connection to CouchDB (default = localhost:5984)
var conn = new(cradle.Connection);
var database = conn.database('things');

app.use(bodyParser());


//exporting modules to swagger editor
module.exports = {
  getThingByID: getThingByID,
  allThings: allThings,
  saveThing: saveThing,
  getThingByName: getThingByName,
  deleteThingByID: deleteThingByID
};



/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteThingByID
//
//Deletes specified thing
//Returns 404 if thing is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteThingByID(req, res){
	
	var id = req.swagger.params.ID.value;
	database.remove(id, function(err,doc){
		if (err){
			res.statusCode = 404;
			res.json("Not found");
		}else{
			res.statusCode = 200;
			res.json("Object with ID: " + id +" deleted")
		}
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//getThingByID
//
//Returns document of specified thing
//Returns 404 if thing is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getThingByID(req, res) {

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
//getThingByName
//
//Returns array of documents filtered by name
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getThingByName(req, res) {

	var array = [];
	database.view('things/byName', { key: req.swagger.params.name.value }, function (err, doc) {
		console.log("Length of array: " + doc.length);
		
		for (i = 0; i < doc.length; i++){
			array.push(doc[i].value);
		}
		res.json(array);
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//allThings
//
//Returns array of all things
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allThings(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var array = [];
	database.view('things/all', { key: null }, function (err, doc) {	
		for (var i = 0; i < doc.length; i++){
			array.push(doc[i].value);
		}
		res.json(array);	
	});
}




function checkID(documentID, databaseID , callback){
	var datab = conn.database(databaseID);
	datab.head(documentID, function(err, opt1, opt2){ 
		if(opt2!='404') {				
			callback(true);
		}else{
			
			callback(false);
		}
	})
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//saveThing
//
//Stores a thing in CouchDB
//Returns 404 if thing or situation template are not found
//Returns 504 if CouchDB does not respond
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveThing(req, res){

	var startTime = new Date().getTime();
	var database = conn.database('things');
	//check if referenced _id of thing exists
	if (req.body.name&&req.body.url&&
		req.body.description&&req.body.description){
		if (req.body.id){
				database.save(req.body.id,{
				name: req.body.name,
				url: req.body.url,
				coordinates: req.body.coordinates,
				description: req.body.description,
				monitored: false
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
				coordinates: req.body.coordinates,
				description: req.body.description,
				monitored: false
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
		res.statusCode = 400;
		res.json("Missing JSON attributes");
	}	
}