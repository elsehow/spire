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
        $('#chart_container').html('<div id="y_axis"></div><div id="chart"></div><div id="preview"></div>');
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
        graph.render();
        var preview = new Rickshaw.Graph.RangeSlider({
            graph: graph,
            element: document.getElementById('preview'),
        });
        var y_axis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis'),
        });
        y_axis.render();
        var x_axis = new Rickshaw.Graph.Axis.Time({
            graph: graph,
        });
        x_axis.render();
        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph,
            xFormatter: function(x) {
                var d = new Date((x-tzOffset) * 1000);
                return format_hr_min(d) + ' ' + d.toDateString();
            },
        });
    }

    function update_graph() {
        reset_graph();
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

    function get_data_in_range(to, from) {
        var t = to;
        var ts = [];
        var d = [];
        var n_received = null;
        var n_expected = null;

        while (t + 1000 < from) {
            ts.push(t);
            t += 1000;
        }
        n_received = 0;
        n_expected = ts.length;
        for (var i = 0; i < ts.length; i++) {
            get_data(ts[i], ts[i] + 1000).then(function(res) {
                n_received += 1;
                var data = JSON.parse(res);
                d.push.apply(d, data.data);
            });
        }
        function when_done_hack() {
            if (n_received === null ||
                n_expected === null ||
                n_received < n_expected) {
                setTimeout(when_done_hack, 5000);
            } else {
                update_breath_data(d);
                update_graph();
            }
        }
        when_done_hack();
    }

    function get_all_data() {
        get_data().then(function(res) {
            var data = JSON.parse(res);
            update_breath_data(data.data);
            update_graph();
            var start = data.data.slice(-1)[0].timestamp;
            var end = Math.floor(new Date().getTime() / 1000);
            get_data_in_range(start, end);
        });
    }

    function init() {
        $('#submit').on('click', function(e) {
            var from = Math.floor(new Date($('#from').val()).getTime() / 1000) - tzOffset;
            var to = Math.floor(new Date($('#to').val()).getTime() / 1000) - tzOffset;
            get_data_in_range(from, to);
        });
        $('#all').on('click', function(e) {
            get_all_data();
        });
    }

    return {
        init: init,
    };
})();
