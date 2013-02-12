var moviedb = require('../common/moviedb');

module.exports = function(app) {

   app.get('/api/:method/:parameter?', function(req, res) {
      moviedb.call(req.params.method, req.params.parameter, req.query, function(err, result) {
         res.send(result);
      });
   });
};
