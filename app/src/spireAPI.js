var apiQuerier = require('./apiQuerier.js')

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
  var responseStream = apiQuerier(queryOpts('br',date))
  return responseStream.map(JSON.parse)
}

module.exports = getData
