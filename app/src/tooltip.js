var $ = require('jquery')
  , Kefir = require('kefir')
  , map = function (num, in0, in1, out0, out1) {return (num- in0) * (out1 - out0) / (in1 - in0) + out0 }
  , moment = require('moment')

setup = function (dataStream, $graphsContainer) {
  //setup
  $(document.body).append('<div id = "time-tooltip"></div>')
  
  //setup
  var $tooltip = $('#time-tooltip')
  var mousemoves = Kefir.fromEvents($graphsContainer, 'mousemove').throttle(25)

  //hide+show tooltip
  $graphsContainer.mouseover(function () { $tooltip.show() })
  $graphsContainer.mouseout(function () { $tooltip.hide() })

  moveTooltipToCoordinates = function (ev) {
    $tooltip.css('left', ev.pageX)
    $tooltip.css('top', ev.pageY)
  }

  formatDate = function (d) {
    return moment(d).format('h:mm:ss a')
  }

  // whenever new data comes in 
  dataStream.map(function (d) {
    // get a time range by extracting d.metadata.from/to
    return {
      from: d['metadata']['from'],
      to:   d['metadata']['to']
    }
  // now that we have the daterange, we can setup the tooltip
  }).onValue(function (timerange) {
     var width = $graphsContainer.width()
     var mouseXToTime =  function (ev) {
       var t = map(ev.clientX, 0, width, timerange.from, timerange.to)
       return new Date(t*1000)
     }
     var setTooltip = function (t) { 
       $('#time-tooltip').html(t)
     }
     //map the X position of the mouse to a time in the timerange
     mousemoves.map(mouseXToTime).map(formatDate).onValue(setTooltip)
     // move the tooltip towherever the mouse is
     mousemoves.onValue(moveTooltipToCoordinates)
  })
}

module.exports = setup