window.onload = function() {
    var spire = Spire();
    //var moves = Moves();

    var controls = ControlsUI('#controls');
    var breath_graph = GraphUI({
        parent_selector: '#breath-graph', 
        color: 'steelblue',
        name: 'spire breath data', 
        tzOffset: spire.tzOffset,
    });
    var spire_steps_graph = GraphUI({
        parent_selector: '#spire-steps-graph', 
        name: 'spire steps data', 
        tzOffset: spire.tzOffset,
    });
    //var moves_graph = GraphUI('#moves-graph');
    //
    $('#graphs-container').sortable();

    $(controls).on('new-date', function(ev, date) {
        $('#loading').hide();
        spire.get_data('breath', date).then(function(data) {
            console.log('got spire breath data', data);
            // TODO it would be better to pass this in like
            // breath_graph.update(data, {x: 'timestamp', y: 'value'})
            breath_graph.update(data, 'timestamp', 'value');
        });
        spire.get_data('step', date).then(function(data) {
            console.log('got spire steps data', data);
            spire_steps_graph.update(data, 'timestamp', 'value');
        });
        /*
        moves.get_data(date).then(function(data) {
            console.log('got moves data', data);
            moves_graph.update(data);
        });
        */
    });
};

