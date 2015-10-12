//var KefirGet = require('kefir-get')
var KefirGet = require("kefir-jquery-ajax")

//returns a promise for a GET to the query string
var queryOpts = function (type, date) {
	 if (type == 'br') {
     var url = 'http://127.0.0.1:3000/breath'
	 } else if (type == 'streaks') {
     var url = 'http://127.0.0.1:3000/streaks'
	 }
   return {
    url: url,
    data: { date: date }
  }
}

var getData = function (type, date) {
  var responseStream = KefirGet(queryOpts(type,date))
  return responseStream.map(JSON.parse)
}

module.exports = {
  breath: function (date) { return getData('br', date) }
  , streaks: function (date) { return getData('streaks', date) }
}
