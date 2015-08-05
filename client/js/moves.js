var Moves = function() {
    hello.init({
        moves: {
            name: 'Moves',
            oauth: {
                version: 2,
                auth: 'https://api.moves-app.com/oauth/v1/authorize',
                grant: 'https://api.moves-app.com/oauth/v1/access_token',
            },
            refresh: true,
            scope: {
                basic: 'activity location'
            },
            scope_delim: ' ',
            base: 'https://api.moves-app.com/api/1.1/',
            get: {
                summary: 'user/summary/daily',
                activity: 'user/activities/daily',
                'location': 'user/places/daily',
                storyline: 'user/storyline/daily',
            },
        }
    });
    hello.init(
        { moves: '05m0S3E8PuHf9wAk13HSpAMv9A0P88eE' },
        {
            response_type: 'code',
            redirect_uri: undefined,
            force: false,
        }
    );
    hello('moves').login();
    return { get_data: function() {}};
};
