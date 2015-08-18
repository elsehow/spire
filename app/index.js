var $ = require('jquery')
   , _ = require('lodash')
   , Kefir = require('kefir')
   , Rickshaw = require('rickshaw')
   , dateSelector = require('./src/dateSelector.js')
   , spireAPI = require('./src/spireAPI.js')
   , windowed = require('./src/windowed.js')
   , unixTime = require('unix-timestamp')
   , append = function (html) {$(document.body).append(html)}
   , empty = function (querySelector) {$(querySelector).empty()}

var drawGraph = function (data, querySelector) {
  //empty the div
  empty(querySelector)
  //graph
  var g = new Rickshaw.Graph({
    element: document.querySelector(querySelector),
    renderer:'bar',
    height: 150, 
    series: [{
      color:'steelblue',
      data: data,
    }],
  })
  g.render()  
  //hover detail
  var hoverDetail = new Rickshaw.Graph.HoverDetail({
    graph: g,
    xFormatter: unixTime.toDate
  })
  g.update()
}


var setup = function() {
  //streams
  dateSelectionStream = dateSelector(document)
  spireDataStream = dateSelectionStream.flatMapLatest(spireAPI)
  //setup
  append('<div id="graph1"></div>')
  append('<div id="graph2"></div>')
  append('<div id="graph3"></div>')
  //side effects
  dateSelectionStream.log('fetching') // 'loading spinner'
  spireDataStream.onValue (function (d) {
    // process data
    var timeseries = d['data']
    var w1 = windowed(timeseries, 50) // hi-res breath data
    var w2 = windowed(timeseries, 200) // mid-res breath data
    var w3 = windowed(timeseries, 500) // lo-res breath data
    // draw graph
    drawGraph(w1, '#graph1')
    drawGraph(w2, '#graph2')
    drawGraph(w3, '#graph3')
  })

}

$(document).on('ready', setup)

