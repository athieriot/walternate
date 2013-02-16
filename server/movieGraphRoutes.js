var neo4j = require('neo4j');
var neodb = require('../common/graphdb').neodb;

module.exports = function(app) {

   app.get('/query/:title', function(req, res) {
      var department = req.query.department || ".*";

      var query = [
         'START me = node:movie("id:' + req.params.title + '")',
         'MATCH (me)<-[relation:beIn]-(person)-[:beIn*..2]->(movie)',
         'WHERE relation.department =~ "' + department + '"',
         'RETURN movie, person, relation'
      ].join('\n');

      neodb.query(query, params, function (err, results) {
         if (err) res.send(err);
         else {
            var summary = results.map(function (result) {
               var movie = JSON.parse(result['movie']['_data']['data'].infos).title;
               var person = JSON.parse(result['person']['_data']['data'].infos).name;
               var relation = result['relation']['_data']['data'].department;
               return {
                  movie: movie,
                  via: person,
                  relation: relation
               }
            });

            res.send(summary);
         }
      });
   });
};
