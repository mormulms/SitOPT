
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var http = require('http');
var assert = require('assert');




app.use(bodyParser());


//exporting modules to swagger editor
module.exports = {
  allTemplates: allTemplates,
  saveTemplate: saveTemplate,
  getTemplateByName: getTemplateByName,
  uploadAttachment: uploadAttachment,
  getAttachment: getAttachment,
  deleteTemplate: deleteTemplate
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
function deleteTemplate(req, res){
	removeDocument(req.swagger.params.name.value, function(items) {
		if (items.deletedCount > 0) {
			res.json({name: "Deleted"});
		} else {
			res.statusCode = 404;
			res.json({message: "Not Found"});
		}
	});
}
function removeDocument(name, callback) {
   db.collection('Situationtemplates').deleteOne(
      { "name": name },
      function(err, results) {
         callback(results);
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
	queryName(req.swagger.params.name.value, function(doc){
		if (doc[0].xml == null){
			res.json({message: "No xml data attached"});
		}else{
			res.json({message: doc[0].xml});
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
	console.log(req.swagger.params.name.value);
	

	queryName(req.swagger.params.name.value, function(doc){
		if(doc[0] == null){
			res.statusCode = 404;
			res.json({ message: "Situationtemplate not found"} );
		}else{
			var text = "";
			for (var i = 0; i < req.files.file.length; i++) {
				text += req.files.file[i].buffer.toString()
			}
			attachFile(doc[0], text, function(){
				res.json({ message: "File attached" });
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
//getTemplateByName
//
//Returns array of documents filtered by name
//Returns 404 if document not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getTemplateByName(req, res) {
	queryName(req.swagger.params.name.value, function(array){
		if (array.length > 0) {
			res.json(array[0]);
		} else {
			res.statusCode = 404;
			res.json({message: "Not Found"});
		}
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
	var document = req.swagger.params.body.value;
	db.collection('Situationtemplates').find({name: document.name}).toArray(function (error, array) {
		assert.equal(error, null);
		console.log("length: " + array.length)
		if (array.length == 0) {
			db.collection('Situationtemplates').insertOne( {
				"objecttype" : "Situationtemplate",
				"name" : document.name,
				"situation" : document.situation,
				"xml" : document.xml,
				"description" : document.description,
				"timestamp" : (new Date).getTime()
			}, function(err, result) {
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

