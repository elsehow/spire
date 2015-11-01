var lo = require('lodash')
  , SVG = require('svg.js')
  , linearScale = require('simple-linear-scale')
  , moment = require("moment")
  
function id ($div) {
  return $div.attr('id')
}



var setup = function (_, start, end, $div) {

	$div.empty()

  var width         = $div.width() 

	var height        = 20

  var numKeyframes  = 10

  var wordHeight    = 9 

  var wordPadding   = height/5

	var scaleTime = linearScale([start, end], [0, width])

  var keyframes = lo.range(start, end, (end-start)/numKeyframes)
  keyframes.push(end)

  var draw = SVG(id($div)).size(width,height)

  // draw one big line on top
  draw.line(0,0,width,0).stroke({width:1, color:'#000'})

  // draw one line + one time for each keyframe `k`
  keyframes.forEach(function (k,i) {
    var x = scaleTime(k)
    var t = moment(k*1000).format('h:mm a')
    draw.line(x,height-wordHeight-wordPadding,x,0).stroke({width:1, color:'#000'})
    var text = draw.text(t).move(x,height-wordHeight)
    // right-justify the last keyframe text
    if (i == numKeyframes)
      var anchor = 'end'
    else
      var anchor = 'start'
    text.font({
      size:wordHeight,
      anchor: anchor
    })

  })

}

module.exports = setup
