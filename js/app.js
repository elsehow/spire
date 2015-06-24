window.onload = function() {
    app.init();
};

var app = (function() {
    // TODO a way to prevent anyone from reading the source and stealing the access token would be good
    var access_token = '5b55104c38593937e45252cec198570e0e65c83bbd24278c6f64acf8a2aace76';

    function init() {
        
        hello.init(
            {
                spire: {
                    name: 'Spire',
                    oauth: {
                        version: 2,
                        auth: 'https://app.spire.io/dialog/oauth/',
                        grant: 'https://app.spire.io/oauth/access_token', 
                    },
                    base: 'https://app.spire.io',
                },
            }, 
            {
                redirect_uri: 'index.html'
            }
        );

        hello('spire').login();

        hello.on('auth.login', function(auth) {
            console.log('logged in to spire? auth', auth);
        });        

        /*
        hello.init(
            {
                facebook: '1443430279299971',
            },
            {
                redirect_uri: 'index.html'
            }
        );

        hello.on('auth.login', function(auth) {
            $('#login').hide();
            $('#login-successful').show();
            console.log('auth', auth);
        });
        */
    }

    return {
        init: init,
    };
})();
