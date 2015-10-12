var $ = require('jquery')
  , Kefir = require('kefir')
  , dateSelector = require('./src/dateSelector.js')
  , Tooltip = require('./src/tooltip.js')
  , spireAPI = require('./src/spireAPI.js')
  , esmsAPI = require('./src/esmsAPI.js')
  , windowed = require('./src/windowed.js')
  , barGraph = require('./src/barGraph.js')
  , wordGraph = require('./src/wordGraph.js')
  , streaksGraph = require('./src/streaksGraph.js')

// TODO
// establish a time range for all graphs
// make a graph for streaks

var setup = function() {

  //setup
  $(document.body).append('<div id = "loadingMessage"></div>')
  $(document.body).append('<div id = "graphsContainer"></div>')
  var $graphsContainer = $('#graphsContainer')
	var $loadingMessage = $('#loadingMessage')
  // loading stuff
  var set_loading_msg = function (date) { $loadingMessage.html('loading ' + date) }
  var clear_loading_msg = function () { $loadingMessage.empty() }
  // graphing stuff
  var breath_graph = function (d) {
    var timeseries = d['data']
    barGraph(windowed(timeseries,1), $graphsContainer)
  }
  var sms_graph = function (d) { wordGraph(d, $graphsContainer) }
  var streaks_graph = function (d) { streaksGraph(d, $graphsContainer) }

  //streams
  // TODO DEBUG
  //var dateSelectionStream = dateSelector()
  var dateSelectionStream = Kefir.constant('2015-09-30')
  var breathData          = dateSelectionStream.flatMapLatest(spireAPI.breath)
  var streaksData         = dateSelectionStream.flatMapLatest(spireAPI.streaks)
  var esmsData            = dateSelectionStream.flatMapLatest(esmsAPI)
  var anyData             = Kefir.merge([breathData, streaksData, esmsData])
	
	// side effects
  anyData.onValue(clear_loading_msg)
  dateSelectionStream.onValue(set_loading_msg)
  breathData.onValue(breath_graph)
  esmsData.onValue(sms_graph)
	streaksData.onValue(streaks_graph)

  // setup tooltip
  // Tooltip(breathData, $graphsContainer)

}
$(document).on('ready', setup)
