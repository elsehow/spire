//var KefirGet = require('kefir-get')
var _ = require('lodash')
 , KefirGet = require("kefir-jquery-ajax")
 , moment = require('moment')

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

function filterForDate (date) {
	return function (data) {
		var plusOne = moment(date).add(1,'day')
		var minusOne = moment(date).subtract(1,'day')
		function between (d) {
			if (moment(d.start_at*1000).isBetween(minusOne, plusOne)) {
				return d
			}
		}
  	return _.filter(data, between)
	}
}

module.exports = {
  breath: function (date) { 
    return getData('br', date) 
  }
  , streaks: function (date) { 
    return getData('streaks', date).map(filterForDate(date))
  }
}
