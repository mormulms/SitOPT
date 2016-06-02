'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

/*app.use(function(req, res, next) {
 
});*/

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/SitDB';

global.name = "MongoConn";

MongoClient.connect(url, function(err, database) {
  	assert.equal(null, err);
    global.db = database;  
});


var config = {
  appRoot: __dirname // required config
};

  app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
    
SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(10010);

  console.log('API running at http://localhost:10010');
});
