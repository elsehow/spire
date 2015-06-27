window.onload = function() {
    spire_app.init();
};

var spire_app = (function() {
    var data = null;
    var graph = null;
    var tzOffset = -7 * 3600;

    function init() {
        $('#submit').on('click', function(e) {
            var from = Math.floor(new Date($('#from').val()).getTime() / 1000) - tzOffset;
            var to = Math.floor(new Date($('#to').val()).getTime() / 1000) - tzOffset;
            console.log('from', from, 'to', to);
            graph_data(from, to);
        });
    }

    function format_hr_min(date) {
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        return hours + ':' + minutes;
    }

    function graph_data(from, to) {
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
                try {
                    data = JSON.parse(res);
                    if (data.data.length === 0) {
                        alert('No data points for this time range');
                    }
                    console.log('got response', data);
                    init_graph();
                } catch (e) {
                    console.log('error e', e);
                    alert('Probably there is no data available for this time period.' + e);
                }
            }
        });
    }

    function init_graph() {
        var formatted_data = _.map(data.data, function(o) {
            return { x: o.timestamp + tzOffset, y: o.value };
        });
        console.log('formatted_data', formatted_data);
        graph = new Rickshaw.Graph({
            element: document.querySelector('#chart'),
            width: $(window).width() - 80, // TODO magic numbers are bad
            height: $(window).height() - 80,
            series: [
                {
                    color: 'steelblue',
                    data: formatted_data,
                    name: 'breathing',
                }
            ],
            renderer: 'line',
        });
        graph.render();
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

    return {
        init: init,
    };
})();
