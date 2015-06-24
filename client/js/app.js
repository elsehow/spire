window.onload = function() {
    spire_app.init();
};

var spire_app = (function() {
    var data = null;

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
                var data = JSON.parse(res);
                console.log('got response', data);
            }
        });
    }

    return {
        init: init,
    };
})();
