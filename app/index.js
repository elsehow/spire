var $ = require('jquery')
  , Kefir = require('kefir')
  , dateSelector = require('./src/dateSelector.js')
  , Tooltip = require('./src/tooltip.js')
  , spireAPI = require('./src/spireAPI.js')
  , windowed = require('./src/windowed.js')
  , barGraph = require('./src/barGraph.js')

var setup = function() {
  //streams
  var dateSelectionStream = dateSelector()
  var spireDataStream     = dateSelectionStream.flatMapLatest(spireAPI)
  //setup
  $(document.body).append('<div id = "graphsContainer"></div>')
  var $graphsContainer = $('#graphsContainer')
  //side effects
  dateSelectionStream.onValue(function (date) {
    $graphsContainer.html('loading ' + date)
  })
  // setup graphs
  spireDataStream.onValue (function (d) {
    var timeseries = d['data']
    // clear loading screen
    $graphsContainer.empty()
    // process data
    var w1 = windowed(timeseries, 50) // hi-res breath data
    var w2 = windowed(timeseries, 200) // mid-res breath data
    var w3 = windowed(timeseries, 500) // lo-res breath data
    // draw graphs
    barGraph(w1, $graphsContainer)
    barGraph(w2, $graphsContainer)
    barGraph(w3, $graphsContainer)
  })
  // setup tooltip
  Tooltip(spireDataStream, $graphsContainer)

}
$(document).on('ready', setup)
