
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
  deleteThing: deleteThing,
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
    var document = req.swagger.params.body.value;
	//console.log(req.body.id);
  //validateGeoJSON(req.body.location, function(valid){
    db.collection('Things').find({name: document.name}).count(function (error, count) {
        if (count != 0) {
            res.statusCode = 400;
            res.json({message: "Name already exists"});
        } else {
            db.collection('Things').insertOne( {
                "name" : document.name,
                "url" : document.url,
                "location" : document.location,
                "description" : document.description,
                "sensors" : document.sensors,
                "monitored" : false,
                "timestamp": (new Date).getTime(),
                "owners": document.owners
            }, function(err, result) {
                assert.equal(err, null);
                //console.log(result);
                res.json({message: "Created"});
            });
        }
    });
  //});

	
}




/////////////////////////////////////////////////////////////////////////////////////////////////////
//deleteThingByID
//
//Deletes specified thing
//Returns 404 if thing is not found
/////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteThing(req, res){
	console.log(req.swagger.params.name.value);

	removeDocument(req.swagger.params.name.value, function(items) {
	    if (items.deletedCount > 0) {
            res.json({message: "Deleted"});
        } else {
            res.statusCode = 404;
            res.json({message: "Not found"});
        }
	});
}
function removeDocument(id, callback) {
   db.collection('Things').deleteOne(
      { "name": id },
      function(err, results) {
         callback(results);
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
      if (doc.matchedCount == 0) {
          res.statusCode = 404;
          res.json({message: "Not Found"});
      } else {
          res.json({message: "Updated"});
      }
  });
}
function update(params, callback){

  var tuple = {};
  tuple[params.attribute.value] = params.value.value;
  db.collection('Things').updateOne( 

      {"name" :  params.name.value },
      {

        $set: tuple
      }, function(err, result) {
      assert.equal(err, null);
      //console.log(result);
      callback(result);
    });
}



/////////////////////////////////////////////////////////////////////////////////////////////////////
//allThings
//
//Returns array of all things
/////////////////////////////////////////////////////////////////////////////////////////////////////
function allThings(req, res) {
	getAll(function(allThings) {
        for (var i = 0; i < allThings.length; i++) {
            allThings[i].location = JSON.stringify(allThings[i].location);
        }
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
        doc[0].location = JSON.stringify(doc[0].location)
        doc[0].sensors = doc[0].sensor || []
        delete doc[0].sensor
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
	queryName(req.swagger.params.name.value, function(doc){
	    if (doc.length > 0) {
            doc[0].location = JSON.stringify(doc[0].location);
            doc[0].sensors = doc[0].sensor || [];
            delete doc[0].sensor;
            res.json(doc[0]);
        } else {
            res.statusCode = 404;
            res.json({message: "Not found"});
        }
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
    callback(true);
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
    callback(true);
  }
}





