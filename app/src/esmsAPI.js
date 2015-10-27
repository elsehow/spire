var kefirAjax = require('kefir-jquery-ajax')
 , _ = require('lodash')
 , moment = require('moment')
 , my_phone_number = "%2B13108017846"

//returns a promise for a GET to the query string
var queryOpts = function (start, end, number) {
   var url = 'http://127.0.0.1:3000/esms'
   return {
     url: url
   , data: { 
       start: start 
 	   , end: end
 	   , from: number 
	  }
  }
}

//returns a stream of API responses
var getData = function (startTime, endTime) {
	var opts = queryOpts( startTime , endTime , my_phone_number)
		console.log('opts', opts)
  var responseStream = kefirAjax(opts)
  return responseStream.map(JSON.parse)
}

module.exports = getData

//// turns API response into the form
////
////   [ { body, timestamp, media }, ... ]
//// where each SMS is sorted by timestamp
//var process = function (data) {
//  // get sms bodies
//  var bodies = _.pluck(data, "Body")
//  // get SMS times
//  var times = _.map(data, function (d) {
//    return d.ReceivedAt*1000
//  })
//  // get any media in the SMSs
//  var media = _.pluck(data, "MediaUrl0")
//  var z = _.map(
//    _.zip(bodies, times, media)
//    , function (d) {
//      return {body: d[0], timestamp: d[1], media:d[2]}
//    })
//  return _.sortBy(z, 'timestamp')
//}

