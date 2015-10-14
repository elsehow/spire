var  $        = require('jquery')
   , Rickshaw = require('rickshaw')
   , unixTime = require('unix-timestamp')
   , randomString = require('make-random-string')

var setup = function (data, start, end, $parent) {
  // put a div with a random ID in $parent
  var divID = randomString(3)
  $parent.append('<div id="' + divID + '"></div>')
  var this_el = $('#' + divID).get(0) //needs to be a native html element
  //rickshaw graph
  var graph = new Rickshaw.Graph({
    element: this_el,
    renderer:'bar',
    height: 150, 
    series: [{color:'#004358', data: data}],
  })
  graph.render()  
}

module.exports = setup 
