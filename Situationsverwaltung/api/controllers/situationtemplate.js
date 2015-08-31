
var express = require('express');
var app = express();
var cradle = require('cradle');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var http = require('http');
var util = require('util');

//create connection to CouchDB (default = localhost:5984)
var conn = new(cradle.Connection);
var database = conn.database('situationtemplates');

app.use(bodyParser());


//exporting modules to swagger editor
module.exports = {
  getTemplateByID: getTemplateByID,
  allTemplates: allTemplates,
  saveTemplate: saveTemplate,
  getTemplateByName: getTemplateByName,
  uploadAttachment: uploadAttachment,
  getAttachment: getAttachment,
  deleteTemplateByID: deleteTemplateByID

};

/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteTemplateByID
//
//Use document ID to delete the specified situation template
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteTemplateByID(req, res){

	var id = req.swagger.params.ID.value;
	database.remove(id, function(err,doc){
		if (err){
			res.statusCode = 404;
			res.json("Not found");
		}else{
			res.statusCode = 200;
			res.json("Situation template with ID: '" + id +"' deleted")
		}
	});
}
	
/////////////////////////////////////////////////////////////////////////////////////////////////////
//getAttachment
//
//Returns attachment XML data
//not fully implemented
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getAttachment(req, res){
	database.getAttachment(req.swagger.params.ID.value, req.swagger.params.templatename.value, function (err, reply) {
	  if (err) {
	    console.dir("Error")
	    res.json(err);
	    return
	  }else{
	  	console.dir(reply);
	  	res.json("OK");
	  }
	  
	})
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//uploadAttachment
//
//Upload XML file to situation template as an attachment
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function uploadAttachment(req, res){

	var filename = '';
	if (req.swagger.params.templatename.value == undefined){
		filename = 'situationtemplate.xml';
	}else{
		filename = req.swagger.params.templatename.value;
	}

	var attachmentData = {
		name: filename,
		'Content-Type': 'text/xml',
		body: req.files.file.buffer.toString()
	}

	checkID(req.swagger.params.ID.value, 'situationtemplates', function(situationTemplateExists){
		if (!situationTemplateExists){
			res.statusCode = 404;
			res.json("Not found");
		}else{
			database.view('situationtemplates/idAndRev', { key: req.swagger.params.ID.value }, function (err, doc) {
				var idAndRevData = {
				  id: req.swagger.params.ID.value,
				  rev: doc[0].value
				}
				console.log(doc[0].value)
				database.saveAttachment(idAndRevData, attachmentData, function (err, reply) {
				  if (err) {
				    console.dir(err)
				    res.json("Error");
				    return
				  }
				  console.dir(reply);
				  res.json("OK");
				  
				})
			});
		}
	});

}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//getTemplateByID
//
//Returns document of specified situation template
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getTemplateByID(req, res) {
	var id = req.swagger.params.ID.value;
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
//getTemplateByName
//
//Returns array of documents filtered by name
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getTemplateByName(req, res) {

	var array = [];
	database.view('situationtemplates/byName', { key: req.swagger.params.name.value }, function (err, doc) {
		console.log("Length of array: " + doc.length);
		
		for (i = 0; i < doc.length; i++){
			array.push(doc[i].value);
		}
		res.json(array);
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//allTemplates
//
//Returns array of all situation templates
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allTemplates(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var array = [];
	database.view('situationtemplates/all', { key: null }, function (err, doc) {	
		for (var i = 0; i < doc.length; i++){
			array.push(doc[i].value);
		}
		res.json(array);	
	});
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
//checkID
//
//checks metadata of document to check if ID exists
//faster than to query the complete document
/////////////////////////////////////////////////////////////////////////////////////////////////////
function checkID(documentID, databaseID , callback){
	var database = conn.database(databaseID);
	database.head(documentID, function(err, opt1, opt2){ 
		if(opt2!='404') {				
			callback(true);
		}else{
			
			callback(false);
		}
	})
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//saveTemplate
//
//Stores situation template
//XML data is stored afterwards as an attachment
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveTemplate(req, res){

	var startTime = new Date().getTime();
	//check if referenced _id of thing exists
	if (req.body.name&&req.body.description&&
	req.body.situation){
		if (req.body.id){
			database.save(req.body.id,{
				name: req.body.name,
				url: req.body.url,
				situation: req.body.situation,
				description: req.body.description
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
				situation: req.body.situation,
				description: req.body.description
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