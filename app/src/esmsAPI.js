var kefirAjax = require('kefir-jquery-ajax')
 , _ = require('lodash')
 , moment = require('moment')

function setup (phoneNumber) {

	console.log('setting up with', phoneNumber)
  
  //returns a promise for a GET to the query string
  var queryOpts = function (start, end) {
     var url = 'http://127.0.0.1:3000/esms'
     return {
       url: url
     , data: { 
         start: start 
   	   , end: end
   	   , from: phoneNumber
  	  }
    }
  }
  
  //returns a stream of API responses
  var getData = function (startTime, endTime) {
  	var opts = queryOpts( startTime , endTime)
    var responseStream = kefirAjax(opts)
    return responseStream.map(JSON.parse)
  }

	return getData
}

module.exports = setup
