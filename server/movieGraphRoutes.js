var neo4j = require('neo4j');
var neodb = require('../common/graphdb').neodb;
var _ = require('underscore')._;

module.exports = function(app) {

  app.route({ path: '/query/{title}',
    method: 'GET',
    handler: function(request) {
      var department = request.query.department || ".*";

      var query = [
         'START me = node:movie("id:' + request.params.title + '")',
         'MATCH (me)<-[relation:beIn]-(person)-[:beIn*..2]->(movie)',
         'WHERE relation.department =~ "' + department + '"',
         'RETURN movie, person, relation'
      ].join('\n');

      neodb.query(query, {}, function (err, results) {
         if (err) request.reply(err);
         else {
            var summary = results.map(function (result) {
               return {
                  movie: JSON.parse(result['movie']['_data']['data'].infos),
                  person: JSON.parse(result['person']['_data']['data'].infos),
                  department: result['relation']['_data']['data'].department
               }
            });
            request.reply(_.uniq(summary));
         }
      });
   }
  });
};
