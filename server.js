var https = require('https')
  , express = require('express')
  , cors = require('cors')
  , app = express()

app.use(cors());

var spireToken = '14724763f3541cb6c7bbac74f920836f502faa724406e4c6a5642e996366b31a'
var url = 'https://app.spire.io//api/events/br?date=2015-07-16&access_token=' + spireToken;

// NB -
// ALL apis need to give us 
// data: [{timeseries, value} .. ]

app.get('/breath', function(req, res) {
    res.writeHead(200);
    console.log('making get request to', url);
    https.get(url, function(res2) {
        res2.pipe(res)
    }).on('error', function(e) {
        console.log('error making GET request to ' + url + '\n' + e.message);
    });
});

app.listen(3000, function() {
    console.log('CORS-enabled web server listening on port 3000');
});
