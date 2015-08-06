var GraphUI = function (options) {

    if (options.parent_selector === undefined) {
        throw "GraphUI: You have to tell the graph where to draw itself by providing a 'parent_selector' jQuery selector in the initialization options.";
    }
    if (options.color === undefined) {
        options.color = 'black';
    }
    if (options.name === undefined) {
        options.name = 'generic data';
    }
    if (options.tzOffset === undefined) {
        // TODO force the user to specify tzOffset because they need to think about it even if they don't want to
        options.tzOffset = 0;
    }

    var that = {};
    // TODO change the IDs in the template to classes because with multiple graphs there will be multiple elements with the same ID
    var template = _.template('<h2 class="graph-title"><%=name%></h2><div id="chart"></div><div id="preview"></div>');
    var series_data = [];
    var preview = null;

    function format_hr_min(date) {
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        if (minutes.length < 2) {
            minutes = '0' + minutes;
        }
        return hours + ':' + minutes;
    }

    that.update = function(data, xkey, ykey) {
        series_data = _.map(data, function(o) {
            return { x: o[xkey], y: o[ykey] };
        });
        // TODO remember to sort series_data by x

        $(options.parent_selector).empty().append($(template({name: options.name})));

        var graph = new Rickshaw.Graph({
            element: $(options.parent_selector).find('#chart')[0],
            width: $(window).width() - 150,
            height: 150,
            series: [{color: options.color, data: series_data, name: options.name}],
            renderer: 'line',
        });
        // TODO why is this called preview instead of zoomslider
        var preview = new Rickshaw.Graph.RangeSlider({
            graph: graph,
            element: $(options.parent_selector).find('#preview')[0],
        });
        graph.render();
        var y_axis = new Rickshaw.Graph.Axis.Y({
            graph: graph,
            ticksTreatment: 'glow',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        });
        y_axis.render();
        var x_axis = new Rickshaw.Graph.Axis.Time({
            graph: graph,
        });
        x_axis.render();
        // TODO i think the hoverDetail needs to get updated somehow when the rangeslider changes? it starts to look a little off
        var hoverDetail = new Rickshaw.Graph.HoverDetail({
            graph: graph,
            xFormatter: function(x) {
                var d = new Date((x-options.tzOffset) * 1000);
                return format_hr_min(d) + ' ' + d.toDateString();
            },
        });
        graph.update();
    };


    return that;
};
