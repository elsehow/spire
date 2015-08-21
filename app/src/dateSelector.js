var $ = require('jquery')
var Kefir = require('kefir')
var append = function (html) {$(document.body).append(html)}

var getSelectorDate = function (ev) { return ev.target.value }

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
}

module.exports = setup
