var $ = require('jquery')
var Kefir = require('kefir')
var moment = require('moment') 
var append = function (html) {$(document.body).append(html)}

var getSelectorDate = function (ev) { return ev.target.valueAsDate }

var convertDateFormat = function (d) { return moment(d).format('YYYY-MM-DD') }

var setup = function (doc) {

  //draw html
  var template = '<input type = "date" id = "dateSelector"> <button id="fetch">fetch my breathing data</button>'
  append(template)

  //streams
  var dateSelectorEvents  = Kefir.fromEvents($('#dateSelector'), 'change')
  var buttonClickStream   = Kefir.fromEvents($('#fetch'), 'click')

  //returns a stream of dates 
  return dateSelectorEvents
          .sampledBy(buttonClickStream)
          .map(getSelectorDate)
          .map(convertDateFormat)
}

module.exports = setup
