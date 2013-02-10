
var express = require('express');
var app = express();
 
require('./movieDbRoutes')(app);
require('./graphRoutes')(app);
/* Required Route Files */

module.exports = app;
