var gzippo = require('gzippo');
var app = require('./server/index.js')

app.use(gzippo.staticGzip(__dirname + '/dist'));

app.listen(process.env.PORT || 3501);
