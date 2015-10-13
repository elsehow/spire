var kefirAjax = require('kefir-jquery-ajax')
 , _ = require('lodash')
 , my_phone_number = "%2B13108017846"

//returns a promise for a GET to the query string
var queryOpts = function (date, number) {
   var url = 'http://127.0.0.1:3000/esms'
   return {
    url: url,
    data: { date: date, from: number }
  }
}

// takes an array of data from the ESMS api
// returns a list of objects that look like
// { body, timestamp, media} 
// sorted by timestamp
var process = function (data) {
  // get sms bodies
  var bodies = _.pluck(data, "Body")
  // get SMS times
  var times = _.map(data, function (d) {
    return d.ReceivedAt*1000
  })
  // get any media in the SMSs
  var media = _.pluck(data, "MediaUrl0")
  var z = _.map(
    _.zip(bodies, times, media)
    , function (d) {
      return {body: d[0], timestamp: d[1], media:d[2]}
    })
  return _.sortBy(z, 'timestamp')
}

//returns a stream* from responses to query()'s AJAX request
var getData = function (date, number) {
  var responseStream = kefirAjax(queryOpts(date, my_phone_number))
  return responseStream.map(JSON.parse).map(process)
}


module.exports = getData
