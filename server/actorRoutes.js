var mdb = require('moviedb')('658ffcf4d816755aeb5869136c815b87');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');
var async = require('async');
var _ = require('underscore')._;

module.exports = function(app){

   app.get('/api/persons/:name', function(req, res) {
      mdb.searchPerson({query: req.params.name}, function(err, result) {
         res.send(result);
      });
   });
   app.get('/api/person/:id/info', function(req, res) {
      mdb.personInfo({id: req.params.id}, function(err, result) {
         res.send(result);
      });
   });

   app.get('/api/movies/:name', function(req, res) {
      mdb.searchMovie({query: req.params.name}, function(err, result) {
         res.send(result);
      });
   });
   app.get('/api/movie/:id/info', function(req, res) {
      mdb.movieInfo({id: req.params.id}, function(err, result) {
         res.send(result);
      });
   });

   var indexMovie = function(id, outputCallback) {
      var movieInfo = {};

      async.waterfall([
         function(callback) {
            mdb.movieInfo({id: id}, callback);
         },
         function(movie, callback) {
            movieInfo = movie;
            db.getIndexedNodes('movie', 'id', movie.id, callback);
         }
      ], function(err, result) {
         if(err || _.isEmpty(result)) {
            async.waterfall([
               function(innerCallback) {
                  db.createNode({infos: JSON.stringify(movieInfo)}).save(innerCallback);
               },
               function(node, innerCallback) {
                  node.index('movie', 'id', movieInfo.id, innerCallback);
               }
            ], function(err, result) {
               if(err) {
                  console.log("Fail to add a movie: " + err);
               } else {
                  console.log("Movie: " + movieInfo.title + " added.");
               }

               outputCallback(err, result);
            });
         } else {
            console.log("Movie: " + movieInfo.title + " already in the index.");
            outputCallback(null, result);
         }
      });
   };

   var addRelationshipTo = function(personNode, movieNode, callback) {
      async.waterfall([
         function(innerCallback) {
            personNode.createRelationshipTo(movieNode, 'playedIn', {}, innerCallback);
         },
         function(relationship, innerCallback) {
            relationship.save(innerCallback); 
         }
      ], function(err, result) {
         if(err) {
            console.log("Failing to save this relashionship.");
         } else {
            console.log("Relashionship saved.");
         }
      }
   )};

   var indexPerson = function(movieNode, person, outputCallback) {
      var personInfo = {}
      var personNode = {}

      async.waterfall([
         function(callback) {
            mdb.personInfo({id: person.id}, callback);
         },
         function(person, callback) {
            personInfo = person;
            db.getIndexedNodes('person', 'id', person.id, callback);
         },
         function(indexedPerson, callback) {
            addRelationshipTo(indexedPerson, movieNode, callback);
         }
      ], function(err, result) {
         if(err || _.isEmpty(result)) {
            async.waterfall([
               function(innerCallback) {
                  db.createNode({infos: JSON.stringify(personInfo)}).save(innerCallback);
               },
               function(node, innerCallback) {
                  personNode = node;
                  node.index('person', 'id', personInfo.id, innerCallback);
               },
               function(innerCallback) {
                  addRelationshipTo(personNode, movieNode, innerCallback);
               }
            ], function(err, result) {
               if(err) {
                  console.log("Fail to add a person: " + err);
               } else {
                  console.log("Person: " + personInfo.name + " added.");
               }

               outputCallback(err, personInfo);
            });
         } else {
            console.log("Person: " + personInfo.name + " already in the index.");
            outputCallback(null, personInfo);
         }
      });
   };

   var indexPersons = function(movieNode, casts, callback) {
      async.forEach(casts.cast, async.apply(indexPerson, movieNode), callback);
   };

   app.put('/api/movie/:id/casts', function(req, res) {
      var movieNode = {};
      async.waterfall([
         function(callback) {
            indexMovie(req.params.id, callback);
         },
         function(movie, callback) {
            movieNode = movie;
            mdb.movieCasts({id: req.params.id}, callback);
         },
         function(casts, callback) {
            indexPersons(movieNode, casts, callback);
         }
      ], function(err, result) {
         if (err) {
            res.send("error:" + err);
         } else {
            res.send("succeed");
         }
      });
   });

   app.get('/api/actor/:id', function(req, res) {
  });

  app.post('/api/actors', function(req, res) {
    
  });

  app.put('/api/actor/:id', function(req, res) {

  });

  app.delete('/api/actor/:id', function(req, res) {

  });
};
