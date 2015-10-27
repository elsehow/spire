var _ = require('lodash')
  , $ = require('jquery')
	, moment = require('moment')
  , Kefir = require('kefir')
  , spireAPI = require('./src/spireAPI.js')
  , esmsAPI = require('./src/esmsAPI.js')
  , barGraph = require('./src/barGraph.js')
  , wordGraph = require('./src/wordGraph.js')
  , streaksGraph = require('./src/streaksGraph.js')
  , Tooltip = require('./src/tooltip.js')
	, dragula = require('dragula')

// each api has a function looks like
//
//    function api (startTime, endTime)
//
// where both values are UNIX timestamps. 
// the function returns a kefir stream.
//
// meanwhile, each render function looks like
//
//    function render (data, startTime, endTime, $div)
//
// where some graph of `data` between `startTime` and `endTime` 
// is appended to `$div`.

var plugins = [
  {
		name:     "breath"
  ,	apiFn:    spireAPI.breath
	, renderFn: barGraph
  }
, {
		name:     "streaks"
  ,	apiFn:    spireAPI.streaks
	, renderFn: streaksGraph 
  }
, {
		name:     "esms"
  ,	apiFn:    esmsAPI
	, renderFn: wordGraph
  }
]

// takes any moment-like object
function unixTimestamp (t) {
  return moment(t).format('X')
}


// TODO hi-level comment abt how this program works

var setup = function() {

	// initialize our $ variables
  var $graphsContainer = $('#graphsContainer')

	var $loadingMessage = $('#loadingMessage')

  function setLoadingMessage (date) { 
		$loadingMessage.html('loading ' + date + '...') 
	}

  function clearLoadingMessage () { 
		$loadingMessage.empty() 
	}

	// TODO - these can come from the UI
	// TODO - move away from the deprecated moment() constructor
  var startTime = Kefir.constant('2015-10-26 5:30 pm').map(unixTimestamp)
  var endTime = Kefir.constant('2015-10-26 11:59 pm').map(unixTimestamp)

	// handle querying=>rendering each API
	var allResponseStreams = []
	_.forEach(plugins, function (plugin) {

	  // for each API, turn start/endtime selections into an api request 
		var response = Kefir.combine(
			[startTime, endTime]
		).flatMapLatest(function (ts) {
			return plugin.apiFn(ts[0], ts[1])
		})

	  // add response stream to a list of all responses
	  allResponseStreams.push(response)	

	  // turn each response into a rendered graph
		Kefir.combine(
			[response, startTime, endTime]
		).onValue(function (d) {
			var data = d[0]
			var start = d[1]
			var end = d[2]
			plugin.renderFn(data, start, end, $graphsContainer)
		})
	})

	// handle loading messages
	var userSelections = Kefir.merge([startTime, endTime])
	var anyData        = Kefir.merge(allResponseStreams)
	var allData        = Kefir.combine(allResponseStreams)
  userSelections.onValue(setLoadingMessage)
  anyData.onValue(clearLoadingMessage)
	allData.onValue(function () {
	  // set up draggable div with dragula
	  var drake = dragula($graphsContainer.get())
	})
	userSelections.combine(allData).onValue(function (ts, _) {
		console.log('tooltipping', ts)
		Tooltip(ts[0], ts[1], $graphsContainer)
  })
}
$(document).on('ready', setup)
