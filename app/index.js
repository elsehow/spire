var $ = require('jquery')
  , Kefir = require('kefir')
  , dateSelector = require('./src/dateSelector.js')
  , Tooltip = require('./src/tooltip.js')
  , spireAPI = require('./src/spireAPI.js')
  , esmsAPI = require('./src/esmsAPI.js')
  , windowed = require('./src/windowed.js')
  , barGraph = require('./src/barGraph.js')

var setup = function() {
  //streams
  //var dateSelectionStream = dateSelector()
  // TODO DEBUG
  var dateSelectionStream = Kefir.constant('garbage nonsense for now')
  var spireData           = dateSelectionStream.flatMapLatest(spireAPI)
  var esmsData            = dateSelectionStream.flatMapLatest(esmsAPI)

  //setup
  $(document.body).append('<div id = "graphsContainer"></div>')
  var $graphsContainer = $('#graphsContainer')
  //side effects
  dateSelectionStream.onValue(function (date) {
    $graphsContainer.html('loading ' + date)
  })
  // setup breathing graphs
  spireData.onValue (function (d) {
    var timeseries = d['data']
    // clear loading screen
    $graphsContainer.empty()
    // process data
    var w0 = windowed(timeseries, 1) // hi-res breath data
    var w1 = windowed(timeseries, 10) // hi-res breath data
    // draw graphs
    barGraph(w0, $graphsContainer)
    barGraph(w1, $graphsContainer)
  })
  // setup sms graphs
  esmsData.log('esms!!')
  // setup tooltip
  Tooltip(spireData, $graphsContainer)

}
$(document).on('ready', setup)
