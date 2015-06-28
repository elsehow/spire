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
            renderer: 'line',
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

        update_graph();
    }

    function get_data(from, to) {
        console.log('requesting data from', from, 'to', to);
        $.ajax({
            url: 'http://localhost:3000',
            data: {
                url: 'https://app.spire.io//api/events/br?from=' + from + '&to=' + to,
            },
            error: function(jqxhr, textStatus, errorThrown) {
                console.log('error in ajax request for spire breath data', jqxhr, textStatus, errorThrown);
            },
            method: 'GET',
            success: function(res) {
                console.log('got back res:', res);
                try {
                    data = JSON.parse(res);
                    console.log('got data', data);
                    update_breath_data(data.data);
                } catch (e) {
                    console.log('error e', e);
                }
            }
        });
    }

    function init() {
        reset_graph();
        $('#submit').on('click', function(e) {
            var from = Math.floor(new Date($('#from').val()).getTime() / 1000) - tzOffset;
            var to = Math.floor(new Date($('#to').val()).getTime() / 1000) - tzOffset;
            get_data(from, to);
        });
    }

    return {
        init: init,
    };
})();
