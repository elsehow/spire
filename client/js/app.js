window.onload = function() {
    spire_app.init();
};

var spire_app = (function() {
    var raw_breath_data = [];
    var processed_breath_data = [];
    var graph = null;
    var tzOffset = -7 * 3600;

    function format_hr_min(date) {
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        return hours + ':' + minutes;
    }

    function reset_graph() {
        $('#chart_container').html('<div id="y_axis"></div><div id="chart"></div>');
        graph = new Rickshaw.Graph({
            element: document.querySelector('#chart'),
            width: $(window).width() - 80, // TODO magic numbers are bad
            height: $(window).height() - 200,
            series: [
                {
                    color: 'steelblue',
                    data: processed_breath_data,
                    name: 'breaths per minute',
                }
            ],
            renderer: 'scatterplot',
        });
        var y_axis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis'),
        });
        var axes = new Rickshaw.Graph.Axis.Time({
            graph: graph,
        });
        axes.render();
        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph,
            xFormatter: function(x) {
                var d = new Date((x-tzOffset) * 1000);
                return format_hr_min(d) + ' ' + d.toDateString();
            },
        });
    }

    function update_graph() {
        graph.update();
    }

    function reset_breath_data() {
        raw_breath_data = [];
        processed_breath_data = [];
    }

    function update_breath_data(d) {
        raw_breath_data.push.apply(raw_breath_data, d);
        _.sortBy(raw_breath_data, function (o) {
            return o.timestamp;
        });

        var new_processed_breath_data = _.map(d, function(o) {
            return { x: o.timestamp + tzOffset, y: o.value };
        });
        processed_breath_data.push.apply(processed_breath_data, new_processed_breath_data);
        _.sortBy(processed_breath_data, function(o) {
            return o.x;
        });
    }

    function get_data(from, to) {
        console.log('requesting data from', from, 'to', to);
        var spire_query = 'https://app.spire.io//api/events/br?';
        if ( from !== undefined && to !== undefined) {
            spire_query += 'from=' + from + '&to=' + to;
        }
        return $.ajax({
            url: 'http://localhost:3000',
            data: {
                url: spire_query,
            },
            error: function(jqxhr, textStatus, errorThrown) {
                console.log('error in ajax request for spire breath data', jqxhr, textStatus, errorThrown);
            },
            method: 'GET',
        });
    }

    function get_all_data() {
        var t = null;
        var d = [];
        var n_received = null;
        var n_expected = null;
        get_data().then(function(res) {
            var data = JSON.parse(res);
            update_breath_data(data.data);
            update_graph();
            t = data.data.slice(-1)[0].timestamp;
            console.log('initial time', t, 'with', data.data.length, 'data points');
            d.push.apply(d, data.data);
            var ts = [];
            while (t * 1000 < Date.now()) {
                ts.push(t);
                t += 1000;
            }
            n_expected = ts.length;
            console.log('ts', ts);
            for (var i = 0; i < ts.length; i++) {
                console.log('requesting data for time', ts[i]);
                get_data(ts[i], ts[i] + 1000).then(function(res) {
                    n_received += 1;
                    var data = JSON.parse(res);
                    console.log('from time', data.data.slice(-1)[0].timestamp, 'with', data.data.length, 'data points');
                    d.push.apply(d, data.data);
                });
            }
        });
        function when_done_hack() {
            console.log('when done hack n_received', n_received, 'n_expected', n_expected);
            if (n_received === null ||
                n_expected === null ||
                n_received < n_expected) {
                setTimeout(when_done_hack, 5000);
            } else {
                console.log('\t DONE');
                update_breath_data(d);
                update_graph();
            }
        }
        when_done_hack();
    }

    function init() {
        reset_graph();
        $('#submit').on('click', function(e) {
            var from = Math.floor(new Date($('#from').val()).getTime() / 1000) - tzOffset;
            var to = Math.floor(new Date($('#to').val()).getTime() / 1000) - tzOffset;
            get_data(from, to).then(function(res) {
                console.log('got back res:', res);
                try {
                    data = JSON.parse(res);
                    console.log('got data', data);
                    reset_graph();
                    reset_breath_data();
                    update_breath_data(data.data);
                    update_graph();
                } catch (e) {
                    console.log('error e', e);
                }
            });
        });
        $('#all').on('click', function(e) {
            get_all_data();
        });
    }

    return {
        init: init,
    };
})();
