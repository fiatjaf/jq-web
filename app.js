const React = require('react')
const render = require('react-dom').render

window.xtend = require('xtend')

const Main = require('./Main')

render(
  React.createElement(Main),
  document.getElementById('root')
)
