var _ = require('lodash')
    , $ = require('jquery')
    , SVG = require('svg.js')
		, linearScale = require('simple-linear-scale')
		 
var setup = function (spireResp, start, end, $div) {

  var width     = $div.width() 

  var height    = 300 // TODO magic numbers lol

  var dotRadius = 4   // TODO magic numbers lol

	var maxValue  = _.max(values(spireResp))

	var blue      = '#004358'  

	var xScale    = linearScale([start, end], [0, width])

	var yScale    = linearScale([0, maxValue], [0, height]);

  function values (spireResp) {
    return _.pluck(spireResp.data, 'value')
  }
  
	function drawCircle (draw, xPos, yPos) {
		draw.circle(dotRadius)
			  .fill({color:blue})
				.move(xPos,yPos)
	}

	// draw graph
	$div.empty()
  var drawCtx = SVG($div.attr('id')).size(width,height)
  _.forEach(spireResp.data, function (d) {
		var x = xScale(d.timestamp)
		var y = yScale(d.value)
		drawCircle(drawCtx, x, y)
  })

}
	
module.exports = setup





