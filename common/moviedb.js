var mdb = require('moviedb')('658ffcf4d816755aeb5869136c815b87');
var _ = require('underscore')._;

moviedbCall = function(method, parameter, options, callback) {
   var query = _.extend(options, {
      query: parameter,
      id: parameter
   });

   mdb[method](query, callback);
}

module.exports = {
   call: moviedbCall   
}
