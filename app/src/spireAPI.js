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

function fetchData (type, date) {
  var responseStream = KefirGet(queryOpts(type,date))
  return responseStream.map(JSON.parse)
}

// returns a date from a unix time
function getDate (unixTime) {
  return moment(unixTime*1000).format('YYYY-MM-DD')
}

function withinTime (start, end) {
	return function (data) {
		return _.filter(data, function (streak) {
      if (moment(streak.start_at*1000).isBetween(start*1000, end*1000))
		    return streak 
		})
	}
}

module.exports = {
  breath: function (startTime, endTime) { 
		var date = getDate(startTime)
    return fetchData('br', date)
  }
  , streaks: function (startTime, endTime) { 
		var date = getDate(startTime)
    return fetchData('streaks', date).map(withinTime(startTime, endTime))
  }
}
