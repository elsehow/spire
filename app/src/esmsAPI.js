var apiQuerier = require('./apiQuerier.js')

//returns a promise for a GET to the query string
var queryOpts = function (date, number) {
   var url = 'http://127.0.0.1:3000/sms'
   return {
    url: url,
    data: { date: date, number: number }
  }
}

//returns a stream* from responses to query()'s AJAX request
var getData = function (date, number) {
  var responseStream = apiQuerier(queryOpts(date, "my-phone-number"))
  return responseStream.map(JSON.parse)
}

module.exports = getData
