var Hapi = require('hapi');
var address = require('fs').readFileSync('.server').toString().split(':');

var app = new Hapi.Server(process.env.HOST || address[0], parseInt(process.env.PORT || address[1]));

require('./movieDbRoutes')(app);
require('./movieGraphRoutes')(app);

module.exports = app;
