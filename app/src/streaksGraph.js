var _ = require('lodash')
    , $ = require('jquery')
    , SVG = require('svg.js')

var setup = function (streaksApiData, start, end, $div) {

	$div.empty()

  var width = $div.width() 
	var barHeight = 30
  var height = barHeight*4 // bar height * number of categories
  var scaleTime = function (t) {
    return (t - start) / (end-start) * width
  }

	function color (t) {
		if (t==="tense")    return  '#FD7400'  //'#D92525' // '#f00' //red 
		if (t==="calm")     return  '#004358'  // #040DBF' // '#0f0' // blue 
		if (t==="focus")    return  '#BEDB39'  //'#88A61B' // '#00f' //green
		if (t==="activity") return  '#FFE11A'  //'#F29F05' // '#ff0' // yellow
		//if (t==="inactive") return  '#eee'  
	}

	function yPos(t) {
		if (t==="tense") return 0
		if (t==="calm") return 2*barHeight
		if (t==="focus") return 3*barHeight
		if (t==="activity") return 4*barHeight
		//if (t==="inactive") return 5*barHeight
	}

	function xPos (startTime) {
		return scaleTime(startTime)
	}

	function barWidth (startTime, endTime) {
		return scaleTime(endTime) - scaleTime(startTime)
	}

	function drawBar (draw, color, yPos, xPos, w) {
		draw.rect(w,barHeight)
			  .fill({color:color})
				.move(xPos,yPos)
	}

  var drawCtx = SVG($div.attr('id')).size(width,height)
  streaksApiData.forEach(function (d) {
		drawBar(
			drawCtx // svg drawing context
			, color(d.type)  // color is a fn of data type (focus/tense/etc)
			, yPos(d.type) // y pos is also a fn of data type
			, xPos(d.start_at)
			, barWidth(d.start_at, d.stop_at))
  })

//	function drawBarFlat (draw, color, xPos, width) {
//		draw.rect(width,barHeight)
//			  .fill({color:color})
//				.move(xPos,0)
//	}
//
//  var drawCtx = SVG('streaksTimeline').size(width,barHeight)
//  streaksApiData.forEach(function (d) {
//		drawBarFlat(
//			drawCtx // svg drawing context
//			, color(d.type)  // color is a fn of data type (focus/tense/etc)
//			, xPos(d.start_at)
//			, barWidth(d.start_at, d.stop_at))
//  })
}
	
module.exports = setup





