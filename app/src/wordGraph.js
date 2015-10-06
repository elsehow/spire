var _ = require('lodash')
    , $ = require('jquery')
    , SVG = require('svg.js')

// takes an array of data from the ESMS api
// returns a list of objects that look like
// { body, timestamp, media} 
// sorted by timestamp
var process = function (data) {
  // get sms bodies
  var bodies = _.pluck(data, "Body")
  // get SMS times
  var times = _.map(data, function (d) {
    console.log(new Date(d.ReceivedAt.epoch_time*1000))
    return d.ReceivedAt.epoch_time
  })
  // get any media in the SMSs
  var media = _.pluck(data, "MediaUrl0")
  var z = _.map(
    _.zip(bodies, times, media)
    , function (d) {
      return {body: d[0], timestamp: d[1], media:d[2]}
    })
  return _.sortBy(z, 'timestamp')
}

var setup = function (esmsApiData, $parent) {
  $parent.append('<div id="smsTimeline"></div>')
  $parent.append('<div id="smsMediaTimeline"></div>')
  // returns a list of objects that look like
  // { body, timestamp, media} 
  // sorted by timestamp
  var data = process(esmsApiData)

  var tmin = _.first(data).timestamp
  var tmax = _.last(data).timestamp
  var width = 900 // TODO bad magic number
  var height = 300  // TODO ditto magic numbers BADBADBAD
  var scale_time = function (d) {
    return (d.timestamp - tmin) / (tmax-tmin) * (width - 300)
  }

  var draw = SVG('smsTimeline').size(width,100)
  data.forEach(function (d, i) {
    var x = scale_time(d)
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





