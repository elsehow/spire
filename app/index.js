var _ = require('lodash')
  , $ = require('jquery')
  , Kefir = require('kefir')
  , dateSelector = require('./src/dateSelector.js')
  , spireAPI = require('./src/spireAPI.js')
  , esmsAPI = require('./src/esmsAPI.js')
  , barGraph = require('./src/barGraph.js')
  , wordGraph = require('./src/wordGraph.js')
  , flowGraph = require('./src/streaksGraph.js')
  , Tooltip = require('./src/tooltip.js')

// TODO
// Fix weird day rollover issue for SMS (hint: +/- 24h)
// draw streaks graph................   (hint: if it were p5)

var setup = function() {

  // set up the dOm
  $(document.body).append('<div id = "loadingMessage"></div>')
  $(document.body).append('<div id = "graphsContainer"></div>')
  var $graphsContainer = $('#graphsContainer')
	var $loadingMessage = $('#loadingMessage')
  function setLoadingMessage (date) { 
		$loadingMessage.html('loading ' + date + '...') 
	}
  function clearLoadingMessage () { 
		$loadingMessage.empty() 
	}
  function breathGraph (d, start, end) {
    var timeseries = _.map(d['data'], function (d) {
			return {y: d.value, x: d.timestamp}
		})
    barGraph(timeseries, start, end, $graphsContainer)
  }
  function esmsGraph (d, start, end) { 
		wordGraph(d, start, end, $graphsContainer) 
	}
  function streaksGraph (d, start, end) { 
		flowGraph(d, start, end, $graphsContainer) 
	}
	function tooltip(_, start, end) {
		Tooltip(start, end, $graphsContainer)
	}

	// takes an object of {breath, strekas, esms}
	// maps each (uniquely formatted) dataset
	// and finding the global max + min times for all datasets
	// returns an object of {start, end}, where both are UNIX times
	function globalTimerange (dataObj) {
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
		// returns an object {start, end}
		// where `start` is the minimum start date of all objections
		// and `end` is the maximum end date of all objects 
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

	// produce `rangedData`, an object with all sensor data 
	// + a fields `start` `stop`, representing the global timerange of all other data
	// format: 
	//
	//   { breath, esms, streks, start, end }
	//
	var allData    = Kefir.combine(
			               [breathData,streaksData, esmsData]
						 	   	, function (b, s, e) {
		                     return { breath: b
						 	         	          , esms: e
		                              , streaks: s }
									})
  var timerange  = allData.map(globalTimerange)
	var rangedData = allData.combine(timerange, _.extend)


	// side effects
  // esmsData.log('esms') // DEBUG
  dateSelectionStream.onValue(setLoadingMessage)
  rangedData.onValue(function (d) {
    function drawWith(fn, data) {
 	   fn(data, d.start, d.end)
    }
    drawWith(breathGraph, d.breath);
    drawWith(streaksGraph,d.streaks);
    drawWith(esmsGraph,d.esms);
	  drawWith(tooltip, null)
	})
  allData.onValue(clearLoadingMessage)
	
}
$(document).on('ready', setup)
