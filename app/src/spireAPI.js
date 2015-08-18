var $ = require('jquery')
var Kefir = require('kefir')

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
   var url = 'http://127.0.0.1:3000/breath'
   return { 
    url: url,
    data: { date: date }
  }
}

//returns a stream* from responses to query()'s AJAX request
var getData = function (date) {
  var responseStream = ajax(queryOpts('br',date))
  return responseStream.map(JSON.parse)
}

module.exports = getData
