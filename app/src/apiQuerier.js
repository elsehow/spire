var $ = require('jquery')
var Kefir = require('kefir')
var url = 'https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json?start_date=1985-05-01&end_date=1997-07-01&order=asc&column_index=4&collapse=quarterly&transformation=rdiff'

var ajax = function (options) {
  return Kefir.stream(function(emitter) {
    var promise = $.ajax(options);
    promise.done(emitter.emit);
    promise.fail(function(promise, textStatus, errorThrown) {
      emitter.error(promise.status === 0 ? 'Connection problem' : promise.responseText);
    });
    return function() {
      promise.abort();
    }
  }).take(1).endOnError().toProperty();
}

//returns a promise for a GET to the query string
var queryOpts = function (type, date) {
   return { url: url }
}

//returns a stream* from responses to query()'s AJAX request
var getData = function (date) {
  var opts = queryOpts(date)
  var responseStream = ajax(opts)
  return responseStream
}

module.exports = getData
