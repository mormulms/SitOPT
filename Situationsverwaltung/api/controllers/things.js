
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var assert = require('assert');
var gjv = require("geojson-validation");

app.use(bodyParser());


//exporting modules to swagger editor
module.exports = {
  getThingByID: getThingByID,
  allThings: allThings,
  saveThing: saveThing,
  getThingByName: getThingByName,
  deleteThingByID: deleteThingByID,
  updateAttribute: updateAttribute
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
//saveThing
//
//Stores a thing in CouchDB
//Returns 404 if thing or situation template are not found
//Returns 504 if CouchDB does not respond
/////////////////////////////////////////////////////////////////////////////////////////////////////
function saveThing(req, res){
    insertDocument(req.body, function() {
    res.json("Created");
});

function insertDocument(document, callback) {
   db.collection('Things').insertOne( {
      
      "name" : document.name,
      "url" : document.url,
      "location" : JSON.parse(document.location),
      "description" : document.description,
      "sensor" : document.sensor,
      "monitored" : false,
      "timestamp": (new Date).getTime()
   }, function(err, result) {
    assert.equal(err, null);
    //console.log(result);
    callback(result);
  });
};




/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteThingByID
//
//Deletes specified thing
//Returns 404 if thing is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteThingByID(req, res){
	console.log(req.swagger.params.ID.value);

	removeDocument(req.swagger.params.ID.value, function() {
	    res.json("Deleted");
	});
}
function removeDocument(id, callback) {
   db.collection('Things').deleteOne(
      { "_id": new require('mongodb').ObjectID(id) },
      function(err, results) {
         callback();
      }
   );
};


/////////////////////////////////////////////////////////////////////////////////////////////////////
//updateAttribute
//
//Updates or creates attribute of thing
/////////////////////////////////////////////////////////////////////////////////////////////////////
function updateAttribute(req, res){
  update(req.swagger.params, function(doc){
    res.json("Updated");
  })

}
function update(params, callback){

  var tuple = {};
  tuple[params.attribute.value] = params.value.value;
  db.collection('Things').updateOne( 

      {"_id" :  new require('mongodb').ObjectID(params.ID.value) },
      {

        $set: tuple
      }, function(err, result) {
      assert.equal(err, null);
      //console.log(result);
      callback();
    });
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
//allThings
//
//Returns array of all things
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allThings(req, res) {
	getAll(function(allThings) {
	    res.json(allThings);
	});
}

function getAll(callback) {
   var cursor =db.collection('Things').find( );
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
//getThingByID
//
//Returns document of specified thing
//Returns 404 if thing is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getThingByID(req, res) {
	queryID(req.swagger.params.ID.value, function(doc){
		res.json(doc[0]);
	})
}
function queryID(id, callback){
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




/////////////////////////////////////////////////////////////////////////////////////////////////////
//getThingByName
//
//Returns array of documents filtered by name
/////////////////////////////////////////////////////////////////////////////////////////////////////
function getThingByName(req, res) {
	console.log(req.swagger.params.name.value);
	queryName(req.swagger.params.name.value, function(array){
		res.json(array);
	});

};
function queryName(name, callback){
	var array = [];
	var cursor = db.collection('Things').find( { "name": name  } );
   	cursor.each(function(err, doc) {
      	assert.equal(err, null);
      	if (doc != null) {
         	array.push(doc);
      	}else{
      		callback(array);
      	}
   	});
}





function validateGeoJSON(geoJson, callback){
  console.log(geoJson);
  var parsedGeoJson;
  try{
    parsedGeoJson = JSON.parse(geoJson);
  }catch(exception){
    callback(false);
  }
  
  var featureCollection = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": JSON.parse(geoJson),
        "properties": {}
      }
    ]
  }
  console.log(featureCollection);
  if (gjv.valid(featureCollection)){
    callback(true);
  }else{
    callback(false);
  }
}





