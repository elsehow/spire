var $ = require('jquery')
  , Kefir = require('kefir')
  , dateSelector = require('./src/dateSelector.js')
  , Tooltip = require('./src/tooltip.js')
  , spireAPI = require('./src/spireAPI.js')
  , esmsAPI = require('./src/esmsAPI.js')
  , windowed = require('./src/windowed.js')
  , barGraph = require('./src/barGraph.js')
  , wordGraph = require('./src/wordGraph.js')

var setup = function() {
  //streams
  //var dateSelectionStream = dateSelector()
  // TODO DEBUG
  var dateSelectionStream = Kefir.constant('2015-09-30')
  var spireData           = dateSelectionStream.flatMapLatest(spireAPI)
  var esmsData            = dateSelectionStream.flatMapLatest(esmsAPI)
  var anyData             = Kefir.merge([spireData, esmsData])

  //setup
  $(document.body).append('<div id = "loadingMessage"></div>')
  $(document.body).append('<div id = "graphsContainer"></div>')
  var $graphsContainer = $('#graphsContainer')
  var $loadingMessage = $('#loadingMessage')
  // loading stuff
  var set_loading_msg = function (date) {
    $loadingMessage.html('loading ' + date)
  }
  var clear_loading_msg = function () {
    $loadingMessage.empty()
  }
  // graphing stuff
  var breath_graph = function (d) {
    var timeseries = d['data']
    barGraph(windowed(timeseries,1), $graphsContainer)
  }
  var sms_graph = function (d) { wordGraph(d, $graphsContainer) }

  // side effects
  // loading stuff
  dateSelectionStream.onValue(set_loading_msg)
  anyData.onValue(clear_loading_msg)
  // grapihng stuff
  spireData.onValue(breath_graph)
  esmsData.onValue(sms_graph)

  // setup tooltip
  // Tooltip(spireData, $graphsContainer)

}
$(document).on('ready', setup)
