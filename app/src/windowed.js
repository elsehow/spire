var _ = require('lodash')

var mean = function (coll, key) {
  return _.sum(_.map(coll, key)) / coll.length
}

var averageReading = function (coll) {
 return {
   x:  mean(coll, 'timestamp'),
   y:  mean(coll, 'value'),
 }
}

var windowed = function (timeseries, windowSize) {
 return _.chain(timeseries).chunk(windowSize).map(averageReading).value()
}

module.exports = windowed
