var $ = require('jquery')
   , _ = require('lodash')
   , Kefir = require('kefir')
   , dateSelector = require('./src/dateSelector.js')
   , spireAPI = require('./src/spireAPI.js')
   , windowed = require('./src/windowed.js')
   , BarGraph = require('./src/barGraph.js')

var setup = function() {
  //streams
  dateSelectionStream = dateSelector()
  spireDataStream = dateSelectionStream.flatMapLatest(spireAPI)
  //setup
  drawGraph1 = BarGraph('graph1')
  drawGraph2 = BarGraph('graph2')
  drawGraph3 = BarGraph('graph3')
  //side effects
  dateSelectionStream.log('fetching') // 'loading spinner'
  spireDataStream.onValue (function (d) {
    // process data
    var timeseries = d['data']
    var w1 = windowed(timeseries, 50) // hi-res breath data
    var w2 = windowed(timeseries, 200) // mid-res breath data
    var w3 = windowed(timeseries, 500) // lo-res breath data
    // draw graph
    drawGraph1(w1)
    drawGraph2(w2)
    drawGraph3(w3)
  })

}

$(document).on('ready', setup)

