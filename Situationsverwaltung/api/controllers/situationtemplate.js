
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var http = require('http');
var assert = require('assert');




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
//updateAttribute
//
//Updates or creates XML of situationTemplate
/////////////////////////////////////////////////////////////////////////////////////////////////////
/*function updateXML(req, res){
  update(req.swagger.params.ID, req.body, function(doc){
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.json("Added");
  })

}
function update(id, xml, callback){

  //tuple[params.attribute.value] = params.value.value;
  db.collection('Situationtemplates').updateOne( 

      {"_id" :  new require('mongodb').ObjectID(id.value) },
      {

        $set: xml
      }, function(err, result) {
      assert.equal(err, null);
      //console.log(result);
      callback();
    });
}*/



/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteTemplateByID
//
//Use document ID to delete the specified situation template
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteTemplateByID(req, res){
	removeDocument(req.swagger.params.ID.value, function() {
	    res.json("Deleted");
	});
}
function removeDocument(id, callback) {
   db.collection('Situationtemplates').deleteOne(
      { "_id": new require('mongodb').ObjectID(id) },
      function(err, results) {
         callback();
      }
   );
};

	
/////////////////////////////////////////////////////////////////////////////////////////////////////
//getAttachment
//
//Returns attachment XML data
//not fully implemented
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getAttachment(req, res){
	queryID(req.swagger.params.ID.value, function(doc){
		if (doc[0].xml == null){
			res.json("No xml data attached");
		}else{
			res.json(doc[0].xml);
		}
		
	})
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//uploadAttachment
//
//Upload XML file to situation template as an attachment
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////

/*function updateDocument(document, oldDoc, template, callback) {

   	db.collection('Situationtemplates').updateOne( 
   		{"_id" :  new require('mongodb').ObjectID(oldDoc._id) },
   		{
   			$set: { "thing" : document.thing,
			      "timestamp" : document.timestamp,
			      "situationtemplate" : document.situationtemplate,
			      "occured" : document.occured,
			      "name" : template.situation,
			      "quality": 100},
			$currentDate: {"lastModified": true}
   		}, function(err, result) {
	    assert.equal(err, null);
	    callback();
  	});
};*/

function attachFile(document, xml, callback){
	db.collection('Situationtemplates').updateOne( 
   		{"_id" :  new require('mongodb').ObjectID(document._id) },
   		{
   			$set: {"xml" : xml},
   			$currentDate: {"lastModified":true}
   		}, function(err, result){
   			assert.equal(err,null);
   			callback();
   		}
   	);
}

function uploadAttachment(req, res){
 // res.setHeader('Content-Type', 'application/json');
	console.log(req.files.file.buffer.toString());
	console.log(req.swagger.params.ID.value);
	

	queryID(req.swagger.params.ID.value, function(doc){
		if(doc[0] == null){
			res.json("Situationtemplate not found");
		}else{
			attachFile(doc[0], req.files.file.buffer.toString(), function(){
				res.json("File attached");
			});
		}

	})
	/*var filename = '';
	if (req.swagger.params.templatename.value == undefined){
		filename = 'situationtemplate.xml';
	}else{
		filename = req.swagger.params.templatename.value;
	}

	var attachmentData = {
		name: filename,
		'Content-Type': 'text/xml',
		body: req.files.file.buffer.toString()
	}*/
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//getTemplateByID
//
//Returns document of specified situation template
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getTemplateByID(req, res) {
	queryID(req.swagger.params.ID.value, function(doc){
		res.json(doc[0]);
	})
}

function queryID(id, callback){
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
//getTemplateByName
//
//Returns array of documents filtered by name
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getTemplateByName(req, res) {
	queryName(req.swagger.params.name.value, function(array){
		res.json(array);
	});
}

function queryName(name, callback){
	var array = [];
	var cursor = db.collection('Situationtemplates').find( { "name": name  } );
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
//allTemplates
//
//Returns array of all situation templates
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allTemplates(req, res) {

	getAll(function(all) {
	    res.json(all);
	});
}
function getAll(callback) {
   var cursor =db.collection('Situationtemplates').find( );
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

	insertDocument(req.body, function() {
	    res.json("Created");
	});
}

function insertDocument(document, callback) {
   db.collection('Situationtemplates').insertOne( {
      "objecttype" : "Situationtemplate",
      "name" : document.name,
      "situation" : document.situation,
      "xml" : document.xml,
      "description" : document.description,
      "xml" : document.xml,
      "timestamp" : (new Date).getTime()
   }, function(err, result) {
    assert.equal(err, null);
    //console.log(result);
    callback(result);
  });
};

