var _ = require('lodash')
  , $ = require('jquery')
  , SVG = require('svg.js')
  , linearScale = require('simple-linear-scale')

// adds a new line every n chars
function addNewlines (str, n) {
	var arr = str.split(' ')
	var chunks = _.chunk(arr, n)
	var strings = chunks.map(function (c) { 
		return c.join(' ') 
	})
	return strings.join('\n')
}

var setup = function (data, start, end, $div) {

	$div.empty()

  $div.append('<div id="smsTimeline"></div>')
  $div.append('<div id="smsPhotoTimeline"></div>')

  var width                = $div.width()

  var smsTimelineHeight    = 300 

	var smsHeight            = 100

  var staggerHeight        = smsHeight*1.2

	var wordsPerLine         = 3

  var photosTimelineHeight = 300 

	var photoHeight          = 200

	var photoWidth           = 200

  var photos               = _.filter(data, 'MediaUrl0')

	var texts                = _.filter(data, 'Body')

	var scaleTime            = linearScale([start, end], [0, width])

  // draw texts
  var draw = SVG('smsTimeline').size(width,smsTimelineHeight)
  texts.forEach(function (sms, i) {
		// get the x based on the time of the text
		var x = scaleTime(sms.ReceivedAt)
    // stagger the texts on the y axis
		var y = i*staggerHeight % smsTimelineHeight
    // draw text body
    var body = addNewlines(sms.Body, wordsPerLine)
    draw.text(body).move(x,y)
    // draw a vertical line from the vertical point of the SMS up
    draw.line(x,y,x,0).stroke({width:1, color:'#eee'})
  })

  // draw photos
  draw = SVG('smsPhotoTimeline').size(width,photosTimelineHeight)
  photos.forEach(function (d, i) {
		// get x of photo based on ttime
    var x = scaleTime(d.ReceivedAt)
		// make sure photos dont go offscreen to the right
		if (x+photoWidth > width)
			x -= (x+photoWidth)-width
    draw.image(d.MediaUrl0).move(x,0).size(photoHeight, photoWidth)
  })
}

module.exports = setup





