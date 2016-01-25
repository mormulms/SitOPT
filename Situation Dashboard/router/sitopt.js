
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/SitDB';

MongoClient.connect(url, function(err, database) {
    assert.equal(null, err);
    global.db = database;  
});


//Get all objects
//
//Returns array "things"
/*function getThings(things ,callback){
	
	databaseThing.view('things/all', {key : null}, function(err, docs){
		if (err){
			console.log('Error');
		}else{
			for (var i in docs){
				things[i] = 
				  {id: docs[i].value._id,
				   name: docs[i].value.name,
				   coordinates: docs[i].value.coordinates,
				   description: docs[i].value.description,
				   url: docs[i].value.url,
				   monitored: docs[i].value.monitored};
			}
			callback(things);
		}
	});
}*/	


function getThings(things, callback) {
	getAllThings(function(allThings) {
	    callback(allThings);
	});
}

function getAllThings(callback) {
   var array = [];
   var cursor =db.collection('Things').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         array.push({
         		   	id: doc._id,
				   	name: doc.name,
				   	coordinates: doc.location,
				   	description: doc.description,
				   	url: doc.url,
				   	monitored: doc.monitored}
				   );
      } else {
         callback(array);
      }
   });
};



//Get all situation templates
//
//Returns array "templates"
/*function getTemplates(templates, callback){
	
	//Query view
	databaseTemplate.view('situationtemplates/all', {key : null}, function(err, docs){
		if (err){
			console.log('Error');
		}else{
			for (var i in docs){
				templates[i] = 
				  {id: docs[i].value._id,
				   name: docs[i].value.name,
				   situation: docs[i].value.situation,
				   description: docs[i].value.description};

			}
			callback(templates);
		}
	});
	
}*/

function getTemplates(templates, callback) {

	getAllTemplates(function(allTemplates) {
	    callback(allTemplates);
	});
}
function getAllTemplates(callback) {
   var cursor =db.collection('Situationtemplates').find( );
   var array = [];
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         array.push({
         		   	id: doc._id,
				   	name: doc.name,
				   	description: doc.description,
				   	situation: doc.situation
				   	});
      } else {
         callback(array);
      }
   });
};


//Get all situations
//
//Returns array "situations"
/*function getSituations(situations, callback){
	//Query view


	databaseSituation.view('situations/all', {key : null}, function(err, docs){
		if (err){
			console.log('Error');
		}else{
			for (var i in docs){
				//console.log(docs[i].value._id)
				situations[i] = 
				  {id: docs[i].value._id,
				   name: docs[i].value.name,
				   occured: docs[i].value.occured,
				   situationtemplate: docs[i].value.situationtemplate,
				   thing: docs[i].value.thing,
				   timestamp: docs[i].value.timestamp,
				   quality: docs[i].value.quality
				   //icon: (new Buffer(docs[i].reply)).toString('base64') 
				  };
			}
			callback(situations);
		}
	});	
}*/

function getSituations(situations, callback) {
	getAllSituations(function(allSituations) {
	    callback(allSituations);
	});
}
function getAllSituations(callback) {
   var cursor =db.collection('Situations').find( );
   var array = [];
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         array.push({id: doc._id,
				   name: doc.name,
				   occured: doc.occured,
				   situationtemplate: doc.situationtemplate,
				   thing: doc.thing,
				   timestamp: doc.timestamp,
				   quality: doc.quality
				   //icon: (new Buffer(docs[i].reply)).toString('base64') 
				  });
      } else {
         callback(array);
      }
   });
};


//Start situation recognition
//
//Access attachment of selected situation template
//Use attachment data as input for mapping algorithm
function getTemplateByID(req, res) {
	queryTemplateID(req.swagger.params.ID.value, function(doc){
		res.json(doc[0]);
	})
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

var startSRS = function(templateID){
	//var database = conn.database('situationtemplates');
	console.log("Test");
	console.log(templateID);
	queryTemplateID(templateID, function(doc){	
		/*if (err) {
			console.log("Not found");
		} else {*/
			console.log(JSON.stringify(doc[0]));
			var exec = require('child_process').exec, child;
			child = exec('java -jar public/nodeRed/mappingString.jar ' + 'public/nodeRed/test.json'   +JSON.stringify(doc[0].xml)+' "false" ',
				function (error, stdout, stderr){
		  			//open('http://localhost:1880');
		    		console.log('stdout: ' + stdout);

				    if(error !== null){
				      console.log('exec error: ' + error);
				    }
			});

			//request('http://localhost:5984/situationtemplates/'+templateID+'/'+ (Object.keys(doc._attachments)[0]), function (error, response, body) {
				//if (!error && response.statusCode == 200) {
					
					//var xmlAsString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><SituationTemplate id=\"A0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"situation_template_draft01.xsd\" name=\"SystemObservation\"> <Situation id=\"A1\" name=\"SystemFailure\"> <operationNode id=\"A3\" name=\"combine Sensors\"> <type>or</type> <parent parentID=\"A10\"/> </operationNode> <conditionNode id=\"A4\" name=\"% CPU load\"> <type>type</type> <measureName>measureName</measureName> <opType>greaterThan</opType> <condValue> <value>70</value> </condValue> <parent parentID=\"A3\"/> </conditionNode> <conditionNode id=\"A8\" name=\"MB RAM free\"> <type>type</type> <measureName>measureName</measureName> <opType>lowerThan</opType> <condValue> <value>10</value> </condValue> <parent parentID=\"A3\"/> </conditionNode> <conditionNode id=\"A9\" name=\"StatusCodeChecker\"> <type>type</type> <measureName>measureName</measureName> <opType>notEquals</opType> <condValue> <value>200</value> </condValue> <parent parentID=\"A3\"></parent> </conditionNode> <contextNode id=\"A5\" name=\"memorySensor\"> <parent parentID=\"A8\"></parent> </contextNode> <contextNode id=\"A6\" name=\"cpuSensor\"> <parent parentID=\"A4\"></parent> </contextNode> <contextNode id=\"A7\" name =\"watchdogSensor\"> <parent parentID=\"A9\"/> </contextNode> <situationNode name=\"machine_failed\" id=\"A10\"/> </Situation> </SituationTemplate>";
					
					//reading situation template from XML string from CouchDB
					
					
					//reading situation template from XML file located at server site
				  	//child = exec('java -jar public/mapper/nodeRed/mapping.jar "C:/Users/asst/Desktop/Website/public/mapper/nodeRed/test/situation_template_draft01.xml" "true" "http://localhost:8080" "false"',
				  		

				
			
		//}	
	});
}

//export function to server.js

exports.nodered = function(req, res){
	res.render('home', { title: 'SitOpt'});
	open('http://localhost:1880');
}

exports.things_post_handler = function(req, res) {
	console.log("Body: " + req.body);
	console.log("TemplateID: " + req.body.templateid);
	console.log("ThingID: " + req.body.thingid);
	console.log("ReqID" + req.body.id);
    startSRS(req.body.id);
    //res.render('things', { title: 'Things', things: things, templates: templates});
};

exports.home = function(req, res) {
    res.render('home', { title: 'SitOpt'});
};

exports.api = function(req, res){

	res.render('swagger');
}

exports.situationtemplate = function(req, res){
	var templates = new Object();
	getTemplates(templates, function(templates){
		res.render('situationtemplate', { title: 'Situation Templates', templates: templates});
	});
}

exports.things = function(req, res){
	var templates = new Object();
	var things = new Object();
	var situations = new Object();
	getThings(things, function(things){
		getTemplates(templates, function(templates){
			getSituations(situations, function(situations){
				res.render('things', 
					{ title: 'Things', things: things, templates: templates, situations: situations});
			});

		});	
	});
}
