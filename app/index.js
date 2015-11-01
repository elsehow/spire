// config
var startTimeConfig = '2015-10-27 12:30 pm'
  , endTimeConfig = '2015-10-27 4:15 pm'
  , phoneNumber   = '%2B16265890535'    //richmond
  //, phoneNumber   = '%2B13108017846'  //nick

var _ = require('lodash')
  , $ = require('jquery')
	, moment = require('moment')
  , Kefir = require('kefir')
  , spireAPI = require('./src/spireAPI.js')
  , esmsAPI = require('./src/esmsAPI.js')(phoneNumber)
  , barGraph = require('./src/barGraph.js')
  , streaksGraph = require('./src/streaksGraph.js')
  , wordGraph = require('./src/wordGraph.js')
  , timeScale = require('./src/timeScale.js')
//	, dragula = require('dragula')

// each plugin has a `queryFn` that looks like
//
//    function queryFn (startTime, endTime)
//
// where both values are UNIX timestamps. 
// the function should return a kefir stream.
// TODO: should return a promise
//
// meanwhile, each plugin's `renderFunction` looks like
//
//    function renderFn (data, startTime, endTime, $div)
//
// this fuction should return nothing
// instead, it should append some graph to `$div`

var plugins = [
//  {
//		name:     "breath"
//  ,	queryFn:    spireAPI.breath
//	, renderFn: barGraph
//  }
//, {
//		name:     "streaks"
//  ,	queryFn:    spireAPI.streaks
//	, renderFn: streaksGraph 
//  }
 {
		name:     "esms"
  ,	queryFn:   esmsAPI
	, renderFn:  wordGraph
  }
, { name:     "timeScale"
  , queryFn:   function () { return Kefir.constant(1) }
  , renderFn:  timeScale
  }
]

// takes any moment-like object
function unixTimestamp (t) {
  return moment(t).format('X')
}

// when we get we get values `startTime` and `endTime`,
// we go through each plugin in `plugins`
//
// for each plugin, we query its `queryFn` with `startTime` and `endTime` as arguments.
// we draw the results of this query with the plugin's `renderFn`
//
// as a bonus, we render a tooltip in each plugin's designated div
// the tooltip shows the time that the mouse is over.

var setup = function() {

	// initialize our $ variables
  var $graphsContainer = $('#graphsContainer')

	// TODO - these can come from the UI
	// TODO - move away from the deprecated moment() constructor
  var startTime = Kefir.constant(startTimeConfig).map(unixTimestamp)
  var endTime = Kefir.constant(endTimeConfig).map(unixTimestamp)

	// handle querying=>rendering each API
	_.forEach(plugins, function (plugin) {

    // a $div for our graph
		var $graph = $('<div id = ' + plugin.name + '></div>')
    $graph.html('loading ' + plugin.name)
    $graphsContainer.append($graph)

    var timeSelection = Kefir.combine(
    	[startTime, endTime]
    )

    // turn time selection into an API response
    var response = timeSelection.flatMapLatest(function (ts) {
      var start = ts[0]
      var end   = ts[1]
			return plugin.queryFn(start, end)
		})

	  // turn API response into a rendered graph
		Kefir.combine(
			[response, startTime, endTime]
		).onValue(function (d) {
			var data  = d[0]
			var start = d[1]
			var end   = d[2]
			plugin.renderFn(data, start, end, $graph)
		})
	})
}

$(document).on('ready', setup)
