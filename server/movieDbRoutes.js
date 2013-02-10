var mdb = require('moviedb')('658ffcf4d816755aeb5869136c815b87');
var async = require('async');
var _ = require('underscore')._;

module.exports = function(app) {

   app.get('/api/:method/:name', function(req, res) {
      moviedbCall(req.params.method, req.params.name, function(err, result) {
         res.send(result);
      });
   });
};

moviedbCall = function(method, parameter, callback) {
   mdb[method] ({
      query: parameter,
      id: parameter
   }, callback)
}

module.exports.MovieDB = {
   call: moviedbCall   
}
