var https = require('https')
  , express = require('express')
  , cors = require('cors')
  , app = express();

app.use(cors());

var access_token = '5b55104c38593937e45252cec198570e0e65c83bbd24278c6f64acf8a2aace76';

var moves_client_id = '05m0S3E8PuHf9wAk13HSpAMv9A0P88eE';
var moves_client_secret = 'B4e308S095zII7MuZeZ59QqH2rhnEHMz70l2crj5QF4jKIwiBj8Zzi1sYrPP9TSU';

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

app.get('/moves_oauth2', function(req, res) {
    res.writeHead(200);
    var auth_code = req.query.auth_code;
    var options = {
        host: 'api.moves-app.com',
        path: '/oauth/v1/access_token?'
            + 'grant_type=authorization_code' 
            + '&code=' + auth_code
            + '&client_id=' + moves_client_id
            + '&client_secret=' + moves_client_secret,
        method: 'POST',
    };
    console.log('making post request to moves with auth code', auth_code);
    var req2 = https.request(options, function(res2) {
        var result = '';
        res2.on('data', function(chunk) {
            result += chunk;
        });
        res2.on('end', function() {
            res.write(result);
            console.log(result);
            res.end();
        });
    }).on('error', function(e) {
        console.log(' error making POST request ' + e.message);
    });
    req2.end();
});

app.listen(3000, function() {
    console.log('CORS-enabled web server listening on port 3000');
});
