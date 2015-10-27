var _ = require('lodash')
  , $ = require('jquery')
  , SVG = require('svg.js')

var setup = function (data, start, end, $parent) {

  $parent.append('<div id="smsTimeline"></div>')
  $parent.append('<div id="smsMediaTimeline"></div>')

  var width = $parent.width()
  var height = 300  // TODO magic numbers BADBADBAD
  var scale_time = function (d) {
    return (parseInt(d.ReceivedAt) - start) / (end - start) * width 
  }

  // draw SMS
  var draw = SVG('smsTimeline').size(width,100)
  data.forEach(function (d, i) {
    var x = scale_time(d)
    var y = 30 * (i % 3) + 15;
    // draw text body
    draw.text(d.Body).move(x,y)
    // draw a line from the point of the SMS up
    draw.line(x,y,x,0).stroke({width:1, color:'#eee'})
    //console.log('sms', x, d.body)
  })

  // draw only those sms's that have media attachments
  draw = SVG('smsMediaTimeline').size(width,height)
  mediaData = _.filter(data, 'MediaUrl0')
  mediaData.forEach(function (d, i) {
    var x = scale_time(d)
    draw.image(d.MediaUrl0).move(x,0).size(300,300)
  })
}

module.exports = setup





