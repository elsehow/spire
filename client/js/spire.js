var Spire = function() {
    var all_data = {
        breath: [],
        step: [],
    };
    var tzOffset = -7 * 3600;

    function update_all_data(type, d) {
        // type should be 'breath' or 'step'
        _.each(d, function(o) {
            o.timestamp += tzOffset;
        });
        all_data[type].push.apply(all_data[type], d);
        _.sortBy(all_data[type], function(o) {
            return o.timestamp;
        });
    }

    function query(type, date) {
        var q = 'https://app.spire.io//api/events/' + type + '?date=' + date;
        return $.ajax({
            url: 'http://localhost:3000',
            data: {
                url: q,
            },
            error: function() {
                console.log('Spire: error in ajax request for data', arguments);
            },
            method: 'GET',
        });
    }

    function get_data(type, date) {
        var event_type = '';
        if (type === 'breath') {
            event_type = 'br';
        } else if (type === 'step') {
            event_type = 'step';
        } else {
            throw "Spire: you must specify a data type you want, either 'breath' or 'step'";
        }
        if (date === undefined) {
            throw "Spire: you must specify the date you want data for, e.g., '2015-07-10'";
        }
        return query(event_type, date).then(function(res) {
            var data = JSON.parse(res);
            if (event_type == 'br') {
                update_all_data('breath', data.data);
                return all_data.breath;
            } else if (event_type == 'step') {
                update_all_data('step', data.data);
                return all_data.step;
            }
        });
    }

    return { get_data: get_data, tzOffset: tzOffset };
};
