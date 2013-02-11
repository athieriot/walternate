var mdb = require('moviedb')('658ffcf4d816755aeb5869136c815b87');
var async = require('async');
var _ = require('underscore')._;

module.exports = function(app) {

   app.get('/api/:method/:parameter?', function(req, res) {
      moviedbCall(req.params.method, req.params.parameter, req.query, function(err, result) {
         res.send(result);
      });
   });
};

moviedbCall = function(method, parameter, options, callback) {
   var query = _.extend(options, {
      query: parameter,
      id: parameter
   });

   mdb[method](query, callback);
}

module.exports.MovieDB = {
   call: moviedbCall   
}
