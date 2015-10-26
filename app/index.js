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
//
//
//
//
// we have several APIs here, spireAPI, esmsAPI, ..
// when a value comes through `dateSelectionStream`,
// we flat map that data to a response from each API
//
// that response gets passed, unchanged, to a view function
// see (side-effecy view functions, below)
//
// in the meantime, we collect responses from each API to find a
// global start and stop time
//
// produce `rangedData`:
//
//   { breath, esms, streaks, start, end }
//
// where breah, esms, streaks, ... all have their own special format
// but where start + end represent the global endpoints for all data
//

var setup = function() {

  // set up the DOM
	// initialize our $ variables
  $(document.body).append('<div id = "loadingMessage"></div>')
  $(document.body).append('<div id = "graphsContainer"></div>')
  var $graphsContainer = $('#graphsContainer')
	var $loadingMessage = $('#loadingMessage')

	// side-effecty view functions
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

	// finds the global max + min times for each dataset
	// returns an object 
	//
	//   {start, end}
	//
	// where both are UNIX times

	function globalTimerange (breath, streaks, esms) {

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

		var ranges = [
			breath_timerange(breath)
			, streaks_timerange(streaks)
			, esms_timerange(esms)
		]

		// returns an object 
		//
		//   {start, end}
		//
		// where `start` is the minimum start date of all objects
		// and `end` is the maximum end date of all objects 
		
		return range(
				_.min(_.pluck(ranges,'start'))
				, _.max(_.pluck(ranges,'end')))
	}

  //streams
/
  //var dateSelectionStream = dateSelector()  // TODO DEBUG
  var dateSelectionStream = Kefir.constant('2015-10-14')
  var breathData          = dateSelectionStream.flatMapLatest(spireAPI.breath)
  var streaksData         = dateSelectionStream.flatMapLatest(spireAPI.streaks)
  var esmsData            = dateSelectionStream.flatMapLatest(esmsAPI)

	// produce `rangedData`:
	//
	//   { breath, esms, streaks, start, end }
	//
	// where breah, esms, streaks, ... all have their own special format
	// but where start + end represent the global endpoints for all data
	//
	var allData    = Kefir.combine(
			               [breathData,streaksData, esmsData]
                     , function (b, s, e) {
											   var t = globalTimerange(b, s, e)
                         return { breath: b
                                , streaks: s 
                                , esms: e
		                            , start: t.start
		                            , end: t.end
                      }
										)


	// side effects
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
