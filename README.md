[![npm badge](https://img.shields.io/npm/v/jq-web.svg)](https://www.npmjs.com/package/jq-web) [![Mentioned in Awesome jq](https://awesome.re/mentioned-badge.svg)](https://github.com/fiatjaf/awesome-jq)

# jq-web

This is a build of [jq](https://github.com/stedolan/jq), the command-line JSON processor in Javascript using [Emscripten](http://kripken.github.io/emscripten-site/) along with a wrapper for making it usable as a library.

It runs in the browser.

### install and use

```
npm install jq-web
```

```js
var jq = require('jq-web')

jq.json({
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

The code above returns the string `"empty of useless things"`.

You could do the same using the promised API with `jq.promised.json({...}).then(result => {})`. That is useful if you're loading a `.mem` or `.wasm` file, as the library won't return the correct results until these files are asynchronously fetched by the Emscripten runtime.

## WebAssembly

There's a WASM version available at `jq.wasm[.min].js`, it is much faster.

If the target browser supports WebAssembly you can just include it normally. It will automatically look for the binary code at `./jq.wasm.wasm`, so make sure it is available.

You can also import it with browserify `require('jq-web/jq.wasm.js')` if you want.

## Using the non-bundled version

If you can't use WebAssembly, there's a better way to use the asm.js version.

By default, requiring `jq-web` will give you the `./jq.bundle.min.js` file, which comes bundled with the static memory initialization inside the JS code. That's inefficient. For better performance and load sizes, require `jq-web/jq[.min].js` instead, and copy `node_modules/jq-web/jq.js.mem` to the directory you're serving the app from, as it will be loaded asynchronously in the runtime by the library.

### Webpack issues

#### `fs`
The Emscripten runtime will try to `require` the `fs` module, and if it fails it will resort to an in-memory filesystem (almost no use of that is made of the library, but it is needed somehow). In Browserify there's a default `{}` that corresponds to the `fs` module, but in Webpack you must [declare it as an empty module](https://github.com/fiatjaf/jq-web/issues/5#issuecomment-342694955).

#### 404 error when loading `.wasm` files
By default projects compiled with Emscripten look for `.wasm` files in the same directory that the `.js` file is run from. This causes issues when using webpack because name of the `.wasm` file is altered with a hash and can be placed in a different directory. To fix this problem you can use the [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) to copy the `jq.wasm` file to the same directory that the webpack bundle is placed.

## Reference

`jq.json(<object>, <filter>) <object>` will take a Javascript object, or scalar, whatever, and dump it to JSON, then it will return whatever your filter outputs and try to convert that into a JS object. If you're loading `.mem` or `.wasm` files asynchronously this will return `{}` every time you call it until the loading is finished.

`jq.raw(<json-string>, <filter>) <raw-output>` will take a string that will be passed as it is to jq (like if you were doing `echo '<json-string>' | jq <filter>` on the command line) then return a string with the raw STDOUT response. If you're loading `.mem` or `.wasm` files asynchronously this will return `'{}'` every time you call it until the loading is finished.

`jq.onInitialized.addListener(<function>)` registers a function to be called when `.mem` or `.wasm` files have finished loading and the library is ready to be used. You should register callbacks here to rerun your functions if you're using the sync API (above). If you're using the promised API (below) you don't ever need to look at this. Also, if you're using the sync API but just at a long time after the page is loaded and the user inputs something, for example, you may not need to use this at all.

`jq.promised.json(<object>, <filter>) Promise<object>` will do the same as `jq.json()` but returning a Promise to the result instead. This is safe to use anytime.

`jq.promised.raw(<json-string>, <filter>) Promise<raw-output>` will do the same as `jq.raw()` but returning a Promise to the result instead. This is safe to use anytime.

## Build

1. [Install Emscripten from source](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html#installation-instructions), we used `1.38.12`
2. Clone `jq-web` and `cd` into it
3. Look over the `Makefile` for more Emscripten instructions
4. `make`
    * This may take a while the first time if you have never ran Emscripten before

## Test
A handful of tests exist in `test.js` and are good place to start when verifying a build
1. `npm install` or `yarn`
2. `node test.js`
