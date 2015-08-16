var $ = require('jquery')
   , _ = require('lodash')
   , Kefir = require('kefir')
   , dateSelector = require('./src/dateSelector.js')
   , myCoolGraph = require('./src/myCoolGraph.js')
   , spireAPI = require('./src/spireAPI.js')
   , windowed = require('./src/windowed.js')

var setup = function() {

  // app
  dateSelectionStream = dateSelector(document)
  spireDataStream = dateSelectionStream.flatMap(spireAPI)

  //side effects
  dateSelectionStream.log('fetching') // 'loading spinner'
  spireDataStream.onValue (function (d) {
    var w = windowed(JSON.parse(d)['data'], 200)
    document.write(JSON.stringify(w))
  })

}

$(document).on('ready', setup)

