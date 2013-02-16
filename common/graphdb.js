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
   return _.slugify(movie.title);
}

var objectifyPerson = function(person) {
   return {infos: JSON.stringify(person)};
}
var identifyPerson = function(person) {
   return _.slugify(person.name);
}

var identifyRelation = function(person, movie) {
   return _.slugify(person.name + "_" + movie.title);
}

var addMovie = function(movie, hop) {
   neodb.getIndexedNodes("movie", "id", identifyMovie(movie), function(err, nodeMovies) {
      if(err || _.isEmpty(nodeMovies)) {
         async.waterfall([
            function(callback) {
               neodb.createNode(objectifyMovie(movie)).save(callback);
            },
            function(nodeMovie, callback) {
               nodeMovie.index("movie", "id", identifyMovie(movie), async.apply(callback, nodeMovie));
            }
         ], function(nodeMovie, err, result) {
            hop(err, nodeMovie);
         });
      } else {
         hop(null, _.first(nodeMovies));
      }
   });
}

var addPerson = function(person, hop) {
   neodb.getIndexedNodes("person", "id", identifyPerson(person), function(err, nodePersons) {
      if(err || _.isEmpty(nodePersons)) {
         async.waterfall([
            function(callback) {
               neodb.createNode(objectifyPerson(person)).save(callback);
            },
            function(nodePerson, callback) {
               nodePerson.index("person", "id", identifyPerson(person), async.apply(callback, nodePerson));
            }
         ], function(nodePerson, err, result) {
            hop(err, nodePerson);
         });
      } else {
         hop(null, _.first(nodePersons));
      }
   });
}

var addRelation = function(person, movie, personNode, movieNode, hop) {
   neodb.getIndexedRelationship("person_movie", "id", identifyRelation(person, movie), function(err, relations) {
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
