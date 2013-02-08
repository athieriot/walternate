
var express = require('express');
var app = express();
 
require('./actorRoutes')(app);
/* Required Route Files */

module.exports = app;
