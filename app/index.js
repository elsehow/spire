var _ = require('lodash')
  $ = require('jquery')
  , Kefir = require('kefir')
  , dateSelector = require('./src/dateSelector.js')
  , Tooltip = require('./src/tooltip.js')
  , spireAPI = require('./src/spireAPI.js')
  , esmsAPI = require('./src/esmsAPI.js')
  , barGraph = require('./src/barGraph.js')
  , wordGraph = require('./src/wordGraph.js')
  , streaksGraph = require('./src/streaksGraph.js')

// TODO
// make a graph for streaks
// figure out why not all SMSs show up in API...

var setup = function() {

  //setup
  $(document.body).append('<div id = "loadingMessage"></div>')
  $(document.body).append('<div id = "graphsContainer"></div>')
  var $graphsContainer = $('#graphsContainer')
	var $loadingMessage = $('#loadingMessage')
  // loading stuff
  function set_loading_msg (date) { 
		$loadingMessage.html('loading ' + date + '...') 
	}
  function clear_loading_msg () { 
		$loadingMessage.empty() 
	}
  // graphing stuff
  function breathGraph (d, start, end) {
    var timeseries = _.map(d['data'], function (d) {
			return {y: d.value, x: d.timestamp}
		})
    barGraph(timeseries, start, end, $graphsContainer)
  }
  function esmsGraph (d, start, end) { 
		 console.log('sanitcheck', start, end)
		wordGraph(d, start, end, $graphsContainer) 
	}
  function streaksGraph (d, start, end) { 
		streaksGraph(d, start, end, $graphsContainer) 
	}
	var globalTimerange = function (dataObj) {
		function range (start, end) {
			return {start: start, end: end}
		}
		function breath_timerange (b) {
			return range(b.metadata.from*1000, b.metadata.to*1000)
		}
		function streaks_timerange (s) {
			return range(_.first(s).start_at*1000, _.last(s).end_at*1000)
		}
		function esms_timerange (e) {
			return range(_.first(e).timestamp, _.last(e).timestamp)
		}
		//function 
		var ranges = [
			breath_timerange(dataObj.breath)
			, streaks_timerange(dataObj.streaks)
			, esms_timerange(dataObj.esms)
		]
		return range(
				_.min(_.pluck(ranges,'start'))
				, _.max(_.pluck(ranges,'end')))
	}

  //streams
  // TODO DEBUG
  //var dateSelectionStream = dateSelector()
  var dateSelectionStream = Kefir.constant('2015-10-12')
  var breathData          = dateSelectionStream.flatMapLatest(spireAPI.breath)
  var streaksData         = dateSelectionStream.flatMapLatest(spireAPI.streaks)
  var esmsData            = dateSelectionStream.flatMapLatest(esmsAPI)
	var allData             = Kefir.combine(
			                        [breathData,streaksData, esmsData]
															, function (b, s, e) {
		                              return { breath: b
														      	     , esms: e
		                                     , streaks: s }
														 	  }
														)
	
	// produce `rangedData`, an object with all sensor data 
	// + a fields `start` `stop`, representing the global timerange of all other data
	// format: 
	//
	//   { breath, esms, streks, start, end }
	//
	 var timerange = allData.map(globalTimerange)
	 var rangedData= allData.combine(timerange, function (dataObj, t) {
		 return _.extend(dataObj, t)
	 })

	 esmsData.log('esms')

	// side effects
	 rangedData.onValue(function (d) {
		 function graphWith(fn, data) {
			 fn(data, d.start, d.end)
		 }
	   graphWith(breathGraph, d.breath)
     graphWith(esmsGraph,d.esms)
	//   graphWith(streaksGraph,d.streaks)
	 })
  dateSelectionStream.onValue(set_loading_msg)
  allData.onValue(clear_loading_msg)
	
	//  OLD-- 
	//  breathData.onValue(breath_graph)
	//  esmsData.onValue(sms_graph)
	//	streaksData.onValue(streaks_graph)

  // setup tooltip
  // Tooltip(breathData, $graphsContainer)

}
$(document).on('ready', setup)
