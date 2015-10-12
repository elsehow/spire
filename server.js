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
  // DEBUG
  , mockAPIresp = require('./test/mockAPIresponses.js')

app.use(cors());
app.use(express.static(publicDir))

//var phoneNumber = '+13108017846'
var spireToken = '14724763f3541cb6c7bbac74f920836f502faa724406e4c6a5642e996366b31a'
var queryURL =  function (type, dateString) {
  return 'https://app.spire.io//api/' + type + '?date=' + dateString + '&access_token=' + spireToken;
}

function getSpireAPI (type,req, res) {
  res.writeHead(200);
  var url = queryURL(type, req.query.date)
  console.log('making get request to ', url)
  https.get(url, function (apiRes) {
    console.log('got response from', url)
    apiRes.pipe(res)
  }).on('error', logError)
}

app.get('/', function (req, res) {
  read('index.html').pipe(res)
})

// DEBUG
// app.get('/breath', function (req, res) {
//   res.writeHead(200);
//   res.end(mockAPIresp.spire)
// })
app.get('/sms', function (req, res) {
  res.writeHead(200);
  res.end(mockAPIresp.esms)
})
app.get('/breath', function (req, res) {
	getSpireAPI('events/br', req, res)
});

app.get('/streaks', function (req, res) {
	getSpireAPI('streaks', req, res)
});

app.listen(3000, function() {
    console.log('CORS-enabled web server listening on port 3000');
});
