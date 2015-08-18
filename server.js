var https = require('https')
  , express = require('express')
  , cors = require('cors')
  , app = express()
  , fs = require('fs')
  , path = require('path')
  , publicDir = path.join(__dirname, 'dist')
  , file = function (fn) { return path.join(publicDir, fn) }
  , read = function (fn) { return fs.createReadStream(file(fn)) }
  , logError = function(e) { console.error(e.message) }

app.use(cors());
app.use(express.static(publicDir))

var spireToken = '14724763f3541cb6c7bbac74f920836f502faa724406e4c6a5642e996366b31a'
var url = 'https://app.spire.io//api/events/br?date=2015-07-16&access_token=' + spireToken;

app.get('/', function (req, res) {
  read('index.html').pipe(res)
})

app.get('/breath', function (req, res) {
  res.writeHead(200);
  console.log('making get request to ', url)
  https.get(url, function (apiRes) {
    apiRes.pipe(res)
  }).on('error', logError)
});

app.listen(3000, function() {
    console.log('CORS-enabled web server listening on port 3000');
});
