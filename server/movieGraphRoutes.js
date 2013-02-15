var neo4j = require('neo4j');
var neodb = new neo4j.GraphDatabase('http://localhost:7474');

module.exports = function(app) {

   app.get('/query/:title', function(req, res) {
      var query = [
         'START me = node:movie("id:' + req.params.title + '")',
         'MATCH (me)<-[:beIn]-(person)-[:beIn]->(movie)',
         'RETURN movie'
      ].join('\n');

      var params = {
           movieTitle: req.params.title
      };

      neodb.query(query, params, function (err, results) {
         if (err) res.send(err);
         else {
            var movies = results.map(function (result) {
               return JSON.parse(result['movie']['_data']['data'].infos).title;
            });

            res.send(movies);
         }
      });
   });
};
