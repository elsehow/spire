var _ = require('lodash')
    , $ = require('jquery')
    , SVG = require('svg.js')


var setup = function (data, start, end, $parent) {
  $parent.append('<div id="smsTimeline"></div>')
  $parent.append('<div id="smsMediaTimeline"></div>')

  var width = 900 // TODO bad magic number
  var height = 300  // TODO ditto magic numbers BADBADBAD
  var scale_time = function (d) {
    return (d.timestamp - start) / (end-start) * (width - 300)
  }

  var draw = SVG('smsTimeline').size(width,100)
  data.forEach(function (d, i) {
    var x = scale_time(d)
		console.log('sms', x, d.body)
    var y = 30 * (i % 4) + 15;
    var text = draw.text(d.body).move(x,y)
  })

  // draw only those sms's that have media attachments
  draw = SVG('smsMediaTimeline').size(width,height)
  mediaData = _.filter(data, 'media')
  mediaData.forEach(function (d, i) {
    var x = scale_time(d)
    if (d.media) draw.image(d.media).move(x,0).size(300,300)
  })
}

module.exports = setup





