require('nodefly').profile(
   process.env.NODEFLY_APPLICATION_KEY,
   [process.env.APPLICATION_NAME,'Heroku']
);

var app = require('./server/index.js')

app.route({
  method: 'GET', path: '/{path*}',
  handler: {
    directory: {
      path: __dirname + '/dist', listing: true
    }
  }
});

app.start();
