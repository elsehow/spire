window.onload = function() {
    spire_app.init();
};

var spire_app = (function() {
    var data = null;
    var graph = null;

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
        var formatted_data = _.map(data.data, function(o) {
            return { x: o.timestamp, y: o.value };
        });
        console.log('formatted_data', formatted_data);
        graph = new Rickshaw.Graph({
            element: document.querySelector('#chart'),
            width: $(window).width() - 80, // TODO magic numbers are bad
            height: $(window).height() - 80,
            series: [{ color: 'steelblue', data: formatted_data }],
        });
        var axes = new Rickshaw.Graph.Axis.Time({graph: graph});
        var y_axis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis'),
        });
        graph.render();
    }

    return {
        init: init,
    };
})();
