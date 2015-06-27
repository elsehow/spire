var https = require('https')
  , express = require('express')
  , cors = require('cors')
  , app = express();

app.use(cors());

var access_token = '5b55104c38593937e45252cec198570e0e65c83bbd24278c6f64acf8a2aace76';

app.get('/', function(req, res) {
    res.writeHead(200);
    var url = req.query.url + '&access_token=' + access_token;
    console.log('making get request to', url);
    var req2 = https.get(url, function(res2) {
        console.log('get request came back');
        res2.on('data', function(chunk) {
            process.stdout.write(chunk);
            res.write(chunk, encoding='utf8');
        });
        res2.on('end', function() {
            console.log('get request on end');
            res.end();
        });
    }).on('error', function(e) {
        console.log('error making GET request to ' + url + '\n' + e.message);
    });
});

app.listen(3000, function() {
    console.log('CORS-enabled web server listening on port 3000');
});
