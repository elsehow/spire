var https = require('https')
  , http = require('http')
  , express = require('express')
  , cors = require('cors')
  , app = express()
  , fs = require('fs')
  , path = require('path')
  , publicDir = path.join(__dirname, 'dist')
  , file = function (fn) { return path.join(publicDir, fn) }
  , read = function (fn) { return fs.createReadStream(file(fn)) }
  , logError = function(e) { console.error(e.message) }
  // DEBUG
  , mockAPIresp = require('./test/mockAPIresponses.js')
  , spireToken = '14724763f3541cb6c7bbac74f920836f502faa724406e4c6a5642e996366b31a'

var spireQueryURL =  function (type, dateString) {
  return 'https://app.spire.io//api/' + type + '?date=' + dateString + '&access_token=' + spireToken;
}

var esmsQueryURL = function (start, end, from) {
  return 'http://esms.cosmopol.is/q?start='+start+'&end='+end+'&from='+from
}

function get (module, url, req, res) {
  res.writeHead(200);
  console.log('making get request to ', url)
  module.get(url, function (apiRes) {
    console.log('got response from', url)
    apiRes.pipe(res)
  }).on('error', logError)
}

function httpsGet (url, req, res) {
	return get(require('https'), url, req, res)
}

function httpGet (url, req, res) {
	return get(require('http'), url, req, res)
}

function getEsmsAPI (req, res) {
	apiGetReq(url, req, res)
}

app.use(cors());

app.use(express.static(publicDir))

app.get('/', function (req, res) {
  read('index.html').pipe(res)
})

app.get('/esms', function (req, res) {
  var url = esmsQueryURL(req.query.start, req.query.end, req.query.from)
	httpGet(url, req, res)
})

app.get('/breath', function (req, res) {
  var url = spireQueryURL('events/br', req.query.date)
	httpsGet(url, req, res)
});

app.get('/streaks', function (req, res) {
  var url = spireQueryURL('streaks', req.query.date)
	httpsGet(url, req, res)
});

app.listen(3000, function() {
    console.log('CORS-enabled web server listening on port 3000');
});
