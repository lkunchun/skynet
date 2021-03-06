
/**
 * Module dependencies.
 */

var express = require('express')
//  , routes = require('./routes')
  , app = express()
  , http = require('http')  
  , server = http.createServer(app)
  , path = require('path')
  , fs = require('fs')
  , nano = require('nano')('http://localhost:5984')
  , db = nano.db.use('skynet')
  , members = nano.db.use('members')
//  , machine = require('./lib/machine.js')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('sKyN3t'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var sp = null
  , activeSocket = null
  

// routes

app.get('/', function(req, res){
  res.render('index', { title: 'skynet' });
});


// Data API routes

// Add a new member.
app.post('/api/member/', function(req, res) {

   members.insert(req.body, function(err, body) {
      if (err) {
         console.log(err.message);
         res.send(500, {'error': err.message});
      } else {
         res.write(JSON.stringify(body));
         res.end();
      }
   }); 

});

// Retrive data for specified member.
app.get('/api/member/:id/', function(req, res) {

   members.get(req.params.id, function(err, body) {
      if (err) {
         console.log(err.message);
         res.send(500, {'error': err.message});
      } else {
         res.write(JSON.stringify(body));
         res.end();
      }
   });

});


// Update existing member data.
app.put('/api/member/:id/', function(req, res) {

   members.get(req.params.id, function(err, member) {
      if (err) {
         console.log(err.message);
         res.send(500, {'error': err.message});
      } else {
         req.body._rev = member._rev;
         members.insert(req.body, req.params.id, function(err, body) {
            if (err) {
               console.log(err.message);
            } else {
               res.write(JSON.stringify(body));
               res.end();
            }
         });
      }
   });

});



server.listen(app.get('port'), function(){
  console.log('skynet server listening on port ' + app.get('port'));
});
