const React = require('react')
const render = require('react-dom').render

window.xtend = require('xtend')

const Main = require('./Main')

render(
  React.createElement(Main),
  document.getElementById('root')
)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js', {scope: location.pathname})
    .then(reg => console.log('service worker registered.', reg.scope))
    .catch(e => console.log('failed to register service worker.', e))
}
