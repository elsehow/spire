window.onload = function() {
    spire_app.init();
};

var spire_app = (function() {
    var data = null;
    var graph = null;

    function format_hr_min(date) {
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        return hours + ':' + minutes;
    }

    function init() {
        $.ajax({
            url: 'http://localhost:3000',
            data: {
                url: 'https://app.spire.io//api/events/br',
            },
            error: function(jqxhr, textStatus, errorThrown) {
                console.log('error in ajax request for spire breath data', jqxhr, textStatus, errorThrown);
            },
            method: 'GET',
            success: function(res) {
                data = JSON.parse(res);
                console.log('got response', data);
                init_graph();
            }
        });
    }

    function init_graph() {
        var tzOffset = -7 * 3600;
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
        $('body').append("from: " + (new Date(data.metadata.from*1000)).toString());
        $('body').append('<br/>');
        $('body').append("to: " + (new Date(data.metadata.to*1000)).toString());
    }

    return {
        init: init,
    };
})();
