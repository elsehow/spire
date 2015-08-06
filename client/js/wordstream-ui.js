var WordstreamUI = function(parent_selector) {

    function update(data) {
        if (data.length === 0) { return; }
        data = _.sortBy(data, function(o) {
            return o.timestamp;
        });
        var tmin = data[0].timestamp;
        var tmax = data.slice(-1)[0].timestamp;
        var width = $(window).width() - 150; // TODO magic numbers are bad especially when you assume they will agree with GraphUI
        var height = 150;  // TODO ditto magic numbers BADBADBAD

        $(parent_selector).empty().append('<h2>wordstream</h2>');
        d3.select(parent_selector)
            .append('svg')
                .attr('width', width)
                .attr('height', height)
             // this here is the d3 magic that gives us a 'text' svg element for each object in the array `data`:
            .selectAll('text').data(data).enter().append('text')
                // for each element, give it properties based on its
                // corresponding object `d` in array `data`
                .attr('x', function(d) {
                    return (d.timestamp - tmin) / (tmax - tmin) * width;
                })
                .attr('y', function(d, i) {
                    return 30 * (i % 4) + 15;    
                })
                .style('stroke', 'black')
                .attr('textanchor', 'left')
                .text(function(d) { return d.words; });


    }
    return { update: update };
};
