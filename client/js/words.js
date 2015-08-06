var Words = function() {
    var tzOffset = 0;

    var fakedata = [
        {words: "sleepy"},
        {words: "tired stressed"},
        {words: "focused"},
        {words: "excited happy"},
        {words: "frustrated annoyed"},
        {words: "busy busy busy"},
        {words: "ugh"},
        {words: "hungry"},
        {words: "worked"},
        {words: "overworked"},
        {words: "sleepy"},
        {words: "frustrated angry"},
        {words: "spacey"},
        {words: "excited impatient"},
        {words: "overworked stressed"},
        {words: "overwhelmed"},
        {words: "grumpy ostrich day ok"},
        {words: "ostrich day again"},
    ];

    function get_data(datestring) {
        var t = new Date(datestring).getTime(); // ms since the epoch
        _.each(fakedata, function(o) {
            t += Math.random() * 1000 * 60 * 60; // space them an hour or less apart
            o.timestamp = Math.round(t/1000); // our other time series have been using timestamps in seconds not milliseconds, so let's keep that going
                                              // TODO be more explicit about how to handle different units for timestamps
        });
        return Promise.resolve(fakedata);
    }

    return { get_data: get_data, tzOffset: tzOffset };
};
