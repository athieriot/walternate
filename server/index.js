
var express = require('express');
var app = express();
 
require('./movieDbRoutes')(app);
require('./movieGraphRoutes')(app);
/* Required Route Files */

module.exports = app;
