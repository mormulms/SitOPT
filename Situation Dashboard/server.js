var express = require('express');
var http = require('http');
var path = require('path');

var sitopt = require('./router/sitopt');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  //app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', sitopt.home);
app.get('/api', sitopt.api);
app.get('/things', sitopt.things);
app.get('/situationtemplate', sitopt.situationtemplate);
app.get('/nodered', sitopt.nodered);

app.post('/', sitopt.things_post_handler);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});