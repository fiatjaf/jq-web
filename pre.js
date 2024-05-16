/** @format */

var stdin = ''
var inBuffer;
var outBuffer;
var errBuffer;

const utf8Encoder = new TextEncoder();

// Note about Emscripten, even though the module is now named 'jq', pre.js still uses Module, but post.js uses 'jq'
Module = Object.assign(
  {
    noInitialRun: true,
    noExitRuntime: false,
    FS: FS,
    preRun: function() {
      FS.init(
        function input() {
          if (!inBuffer && stdin) {
            inBuffer = utf8Encoder.encode(stdin);
          }

          if (inBuffer && inBuffer.length) {
            const thisByte = inBuffer[0];
            inBuffer = new Uint8Array(inBuffer.buffer, inBuffer.byteOffset + 1);
            return thisByte;
          }

          return null;
        },
        function output(c) {
          if (c) outBuffer.push(c)
        },
        function error(c) {
          if (c) errBuffer.push(c)
        }
      )
    }
  },
  Module
)
