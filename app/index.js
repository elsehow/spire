var $ = require('jquery')
  , Kefir = require('kefir')
  , dateSelector = require('./src/dateSelector.js')
  , spireAPI = require('./src/spireAPI.js')
  , windowed = require('./src/windowed.js')
  , barGraph = require('./src/barGraph.js')
  , map = function (num, in_min, in_max, out_min, out_max) {
      return (num- in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

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
  spireDataStream.onValue (function (d) {
    var timeseries = d['data']
    // clear loading screen
    $graphsContainer.empty()
    // process data
    var w1 = windowed(timeseries, 50) // hi-res breath data
    var w2 = windowed(timeseries, 200) // mid-res breath data
    var w3 = windowed(timeseries, 500) // lo-res breath data
    // draw graph
    barGraph(w1, $graphsContainer)
    barGraph(w2, $graphsContainer)
    barGraph(w3, $graphsContainer)
  })
  // setup tooltip
  $(document.body).prepend('<div id = "time-tooltip"></div>')
  spireDataStream.map(function (d) {
    return {
      from: d['metadata']['from'],
      to:   d['metadata']['to']
    }
  }).onValue(function (range) {
     var setTooltip = function (t) { 
       $('#time-tooltip').html(t)
     }
     var mouseXToTime =  function (ev) {
       var cx = ev.clientX
       var t = map(cx, 0, window.innerWidth, range.from, range.to)
       return new Date(t*1000)
     }
     // setup tooltip
     var mouseMoves = Kefir.fromEvents($graphsContainer, 'mousemove')
                           .map(mouseXToTime)
                           .onValue(setTooltip)
  })
}
$(document).on('ready', setup)
