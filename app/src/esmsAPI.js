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
  var responseStream = kefirAjax(opts)
  return responseStream.map(JSON.parse)
}

module.exports = getData
