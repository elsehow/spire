var _ = require('lodash')
  , $ = require('jquery')
	, moment = require('moment')
  , Kefir = require('kefir')
  , spireAPI = require('./src/spireAPI.js')
  , esmsAPI = require('./src/esmsAPI.js')
  , barGraph = require('./src/barGraph.js')
  , wordGraph = require('./src/wordGraph.js')
  , flowGraph = require('./src/streaksGraph.js')
  , Tooltip = require('./src/tooltip.js')

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
//  {
//		name:     "breath"
//  ,	apiFn:    spireAPI.breath
//	, renderFn: barGraph
//  }
//, {
//		name:     "streaks"
//  ,	apiFn:    spireAPI.streaks
//	, renderFn: flowGraph
//  }
 {
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
  var startTime = Kefir.constant('2015-10-14 10:30 am').map(unixTimestamp)
  var endTime = Kefir.constant('2015-10-14 3:15 pm').map(unixTimestamp)

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
		).onValue(function (data, start, end) {
        plugin.renderFn(data, start, end, $graphsContainer)
		})
	})

	// handle loading messages
	var anyData        = Kefir.merge(allResponseStreams)
	var userSelections = Kefir.merge([startTime, endTime])
  userSelections.onValue(setLoadingMessage)
  anyData.onValue(clearLoadingMessage)
}
$(document).on('ready', setup)
