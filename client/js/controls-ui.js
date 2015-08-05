var ControlsUI = function (parent_selector) {
    var that = {};
    var template = _.template('<input type="date"><input type="button" value="Go">');

    that.update = function() {
        $(parent_selector)
            // draw the template
            .empty().append($(template()))
            // assign event listeners
            .find('input[type="button"]').on('click', function() {
                var date = $(parent_selector).find('input[type="date"]').val();
                if (date.length === 0) {
                    alert('Please select a date before clicking Go.');
                    return;
                }
                $(that).trigger('new-date', date);
            });
    }

    that.update();

    return that;
};
