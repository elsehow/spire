var _ = require('lodash')
  , $ = require('jquery')
  , SVG = require('svg.js')
  , linearScale = require('simple-linear-scale')

// adds a new line every n words
function addNewlines (str, n) {
	var words = str.split(' ')
	var nWordChunks = _.chunk(words, n)
	var lines = nWordChunks.map(function (c) { 
	 	return c.join(' ') 
	})
	return lines.join('\n')
}

var setup = function (data, start, end, $div) {

	$div.empty()

  $div.append('<div id="smsTimeline"></div>')
  $div.append('<div id="smsPhotoTimeline"></div>')

  var width = $div.width()

  var smsTimelineHeight    = 300 // TODO magic numbers BADBADBAD

	var smsHeight            = 70

	var wordsPerLine         = 3

  var photosTimelineHeight = 300 // TODO magic numbers BADBADBAD

	var photoHeight          = 150 

	var photoWidth           = 150 

  var photos               = _.filter(data, 'MediaUrl0')

	var texts                = _.filter(data, 'Body')

	var scaleTime            = linearScale([start, end], [0, width])

  // draw texts
  var draw = SVG('smsTimeline').size(width,smsTimelineHeight)
  texts.forEach(function (sms, i) {
		// get the x based on the time of the text
		var x = scaleTime(sms.ReceivedAt)
    // get the y of the text based on index
		var y = (i % (smsTimelineHeight/smsHeight) * smsHeight)
    // draw text body
    var body = addNewlines(sms.Body, wordsPerLine)
    var text = draw.text(body).move(x,y)
    text.font({
      size:10
    })
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





