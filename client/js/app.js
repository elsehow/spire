window.onload = function() {
    var spire = Spire();
    //var moves = Moves();
    var words = Words();

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
    var wordstream = WordstreamUI('#words-graph');
    //var moves_graph = GraphUI('#moves-graph');
    //
    $('#graphs-container').sortable();

    $(controls).on('new-date', function(ev, date) {
        $('#loading').hide();
        spire.get_data('breath', date).then(function(data) {
            console.log('got spire breath data', data);
            // TODO it would be better to pass this in like
            // breath_graph.update(data, {x: 'timestamp', y: 'value'})
            // TODO alternatively maybe you should just have to give the GraphUI
            // data that is already formatted a particular way such as {x: ..., y: ...}
            // and that way each data provider (like spire, moves) just has to know
            // to format it in a standard way?
            breath_graph.update(data, 'timestamp', 'value');
        });
        spire.get_data('step', date).then(function(data) {
            console.log('got spire steps data', data);
            spire_steps_graph.update(data, 'timestamp', 'value');
        });
        words.get_data(date).then(function(data) {
            console.log('words', data);
            wordstream.update(data);
        });
        /*
        moves.get_data(date).then(function(data) {
            console.log('got moves data', data);
            moves_graph.update(data);
        });
        */
    });
};

