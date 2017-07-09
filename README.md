[![npm badge](https://img.shields.io/npm/v/jq-web.svg)](https://www.npmjs.com/package/jq-web)
[![travis badge](https://travis-ci.org/fiatjaf/jq-web.svg?branch=master)](https://travis-ci.org/fiatjaf/jq-web)

# jq-web

This is a build of [jq](https://github.com/stedolan/jq), the command-line JSON processor in Javascript using [Emscripten](http://kripken.github.io/emscripten-site/) along with a wrapper for making it usable as a library.

It runs in the browser.

### install and use

```
npm install jq-web
```

```js
var jq = require('jq-web')

jq({
  a: {
    big: {
      json: [
        'full',
        'of',
        'important',
        'things'
      ]
    } 
  }
}, '.a.big.json | ["empty", .[1], "useless", .[3]] | join(" ")')
```

the code above returns the string `"empty of useless things"`.

## WebAssembly

There's a WASM version available at `jq.wasm[.min].js`, it is much faster.

If the target browser supports WebAssembly you can just include it normally. It will automatically look for the binary code at `./jq.wasm.wasm`, so make sure it is available.

You can also import it with browserify `require('jq-web/jq.wasm.js')` if you want.

## reference

`jq(<object>, <filter>) <object>` will take a Javascript object, or scalar, whatever, and dump it to JSON, then it will return whatever your filter outputs and try to convert that into a JS object.

`jq.raw(<json-string>, <filter>) <raw-output>` will take a string that will be passed as it is to jq (like if you were doing `echo '<json-string>' | jq <filter>` on the command line) then return a string with the raw STDOUT response.

### traffic statistics for this repository

[![](https://ght.trackingco.de/fiatjaf/jq-web)](https://ght.trackingco.de/)
