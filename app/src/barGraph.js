var  $        = require('jquery')
   , Rickshaw = require('rickshaw')
   , unixTime = require('unix-timestamp')
   , append   = function (html) {$(document.body).append(html)}
   , empty    = function (querySelector) {$(querySelector).empty()}

module.exports = function (divID) {

  // draw container to document
  append('<div id="' + divID + '"></div>')

  // make a function that draws a graph of data to the container
  var drawGraph = function (data) {
    var selector = '#' + divID
    //empty the div
    empty(selector)
    //graph
    var g = new Rickshaw.Graph({
      element: document.querySelector(selector),
      renderer:'bar',
      height: 150, 
      series: [{
        color:'steelblue',
        data: data,
      }],
    })
    g.render()  
    //hover detail
    var hoverDetail = new Rickshaw.Graph.HoverDetail({
      graph: g,
      xFormatter: unixTime.toDate
    })
    g.update()
  }

  return drawGraph
}