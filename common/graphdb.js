var neo4j = require('neo4j');
var neodb = new neo4j.GraphDatabase(process.env.NEO4J_URL || 'http://localhost:7474/');
var async = require('async');

var _ = require('underscore')._;
_.str = require('underscore.string');
_.mixin(_.str.exports());

var objectifyMovie = function(movie) {
   return {infos: JSON.stringify(movie)};
}
var identifyMovie = function(movie) {
   return movie.id;
}

var objectifyPerson = function(person) {
   return {infos: JSON.stringify(person)};
}
var identifyPerson = function(person) {
   return person.id;
}

var identifyRelation = function(person, movie) {
   return person.id + "_" + movie.id;
}

var addMovie = function(movie, hop) {
   neodb.getIndexedNodes("movie", "id", identifyMovie(movie), function(err, nodeMovies) {
      if(err || _.isEmpty(nodeMovies)) {
         var nodeMovieGlobal = {};
         async.waterfall([
            function(callback) {
               neodb.createNode(objectifyMovie(movie)).save(callback);
            },
            function(nodeMovie, callback) {
               nodeMovieGlobal = nodeMovie;
               nodeMovie.index("movie", "id", identifyMovie(movie), callback);
            }
         ], function(err, result) {
            hop(err, nodeMovieGlobal);
         });
      } else {
         hop(null, _.first(nodeMovies));
      }
   });
}

var addPerson = function(person, hop) {
   neodb.getIndexedNodes("person", "id", identifyPerson(person), function(err, nodePersons) {
      if(err || _.isEmpty(nodePersons)) {
         var nodePersonGlobal = {};
         async.waterfall([
            function(callback) {
               neodb.createNode(objectifyPerson(person)).save(callback);
            },
            function(nodePerson, callback) {
               nodePersonGlobal = nodePerson;
               nodePerson.index("person", "id", identifyPerson(person), callback);
            }
         ], function(err, result) {
            hop(err, nodePersonGlobal);
         });
      } else {
         hop(null, _.first(nodePersons));
      }
   });
}

var addRelation = function(person, movie, personNode, movieNode, hop) {
   neodb.getIndexedRelationships("person_movie", "id", identifyRelation(person, movie), function(err, relations) {
      if(err || _.isEmpty(relations)) {
         async.waterfall([
            function(callback) {
               personNode.createRelationshipTo(movieNode, 'beIn', {department: person.department}, callback);
            },
            function(relationship, callback) {
               relationship.save(callback); 
            },
            function(relationship, callback) {
               relationship.index("person_movie", "id", identifyRelation(person, movie), callback);
            }
         ], function(err, result) {
            hop(err, result);
         })
      } else {
         hop(null, _.first(relations));
      }
   });
}

module.exports = {
   neodb: neodb,
   addMovie: addMovie,
   addPerson: addPerson,
   addRelation: addRelation
}
