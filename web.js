require('nodefly').profile(
   process.env.NODEFLY_APPLICATION_KEY,
   [process.env.APPLICATION_NAME,'Heroku']
);

var gzippo = require('gzippo');
var app = require('./server/index.js')

app.use(gzippo.staticGzip(__dirname + '/dist'));

var port = require('fs').readFileSync('.server').toString().split(':')[1];
app.listen(process.env.PORT || port);
