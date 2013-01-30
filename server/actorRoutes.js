var mdb = require('moviedb')('658ffcf4d816755aeb5869136c815b87');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var async = require('async');

module.exports = function(app){

   app.get('/api/actors', function(req, res) {
      res.send('You hit an ExpressJS route!');
   });

   app.get('/api/actors/:name', function(req, res) {
      mdb.searchPerson({query: req.params.name}, function(err, result) {
         res.send(result);
      });
   });

   app.get('/api/actor/:id', function(req, res) {
      async.waterfall([
         function(callback) {
            mdb.personInfo({id: req.params.id}, callback);
         },
         function(person, callback) {
            db.createNode({hello: 'world'}).save(callback);
         }
      ], function(err, result) {
         if (err) {
            res.send(err);
         } else {
            res.send(result);
         }
      });
  });

  app.post('/api/actors', function(req, res) {
    
  });

  app.put('/api/actor/:id', function(req, res) {

  });

  app.delete('/api/actor/:id', function(req, res) {

  });
};
