/* global self, fetch, Request */

self.addEventListener('fetch', event => {
  if (event.request.url.match(/jq.min.js/) && 'WebAssembly' in self) {
    event.respondWith(
      fetch(new Request(
        event.request.url.replace('jq.min', 'jq.wasm.min'),
        {
          credentials: 'include',
          mode: 'no-cors',
          referrerPolicy: 'no-referrer-when-downgrade'
        }
      ))
    )
    return
  }

  event.respondWith(
    fetch(event.request)
  )
})
