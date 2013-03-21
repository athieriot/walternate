var moviedb = require('../common/moviedb');

module.exports = function(app) {

  var handleRequest = function(request) {

    moviedb.call(
      request.params.method,
      request.params.parameter,
      request.query,
      function(err, result) {
        request.reply(result);
      }
    );
  };

  app.route({ path: '/api/{method}/{parameter?}',
    method: 'GET', handler: handleRequest
  });
  app.route({ path: '/api/{method}',
    method: 'GET', handler: handleRequest
  });
};
