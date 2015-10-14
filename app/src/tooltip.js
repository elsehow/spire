var $ = require('jquery')
  , Kefir = require('kefir')
  , map = function (num, in0, in1, out0, out1) {return (num- in0) * (out1 - out0) / (in1 - in0) + out0 }
  , moment = require('moment')

setup = function (start, end, $graphsContainer) {

  //setup
  $(document.body).append('<div id = "time-tooltip"></div>')
  var $tooltip = $('#time-tooltip')
  var containerWidth = $graphsContainer.width()
	var height = 40

	function clientX (ev) {
		return ev.clientX
	}

	function xToTime (x) {
    var t = map(x, 0, containerWidth, start, end)
    return new Date(t)
	}

  function formatDate (d) {
    return moment(d).format('h:mm:ss a')
  }

	function setTooltipHtml (str) {
    $tooltip.html(str)
	}

  function moveTooltipToCoordinates (ev) {
    $tooltip.css('left', ev.pageX)
    $tooltip.css('top', ev.pageY-height)
  }

  $graphsContainer.mouseover(function () { $tooltip.show() })
  $graphsContainer.mouseout(function () { $tooltip.hide() })

	// stream of mousemoves
  var mousemoves = Kefir.fromEvents($graphsContainer, 'mousemove').throttle(25)
  // map the X position of the mouse to a time in the timerange
  var datesFromMouseX = mousemoves.map(clientX).map(xToTime).map(formatDate)

  // move the tooltip towherever the mouse is
  mousemoves.onValue(moveTooltipToCoordinates)
  // set tooltip to date corresponding to mouse X position
  datesFromMouseX.onValue(setTooltipHtml)
}

module.exports = setup
