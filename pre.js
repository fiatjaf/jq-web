(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function (a) {
      return factory()
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.jq = factory()
  }
}(this, function () {
  var stdin = ''
  var inBuffer = []
  var outBuffer = []
  var errBuffer = []

  function toByteArray (str) {
    var byteArray = []
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) <= 0x7F) {
        byteArray.push(str.charCodeAt(i))
      } else {
        var h = encodeURIComponent(str.charAt(i)).substr(1).split('%')
        for (var j = 0; j < h.length; j++) {
          byteArray.push(parseInt(h[j], 16))
        }
      }
    }
    return byteArray
  }

  function pad (n) { return n.length < 2 ? '0' + n : n }

  function fromByteArray (data) {
    var array = new Uint8Array(data)
    var str = ''
    for(var i = 0; i < array.length; ++i) {
      str += ('%' + pad(array[i].toString(16)))
    }
    return decodeURIComponent(str)
  }

  var Module = {
    noInitialRun: true,
    noExitRuntime: true,
    preRun: function () {
      FS.init(
        function input () {
          if (inBuffer.length) {
            return inBuffer.pop()
          }

          if (!stdin) return null
 
          inBuffer = toByteArray(stdin)
          stdin = ''
          inBuffer.push(null)
          inBuffer.reverse()
          return inBuffer.pop()
        },
        function output (c) {
          if (c) {
            outBuffer.push(c)
          }
        },
        function error (c) {
          if (c) {
            errBuffer.push(c)
          }
        }
      )
    }
  }

  try {
    var os = 'os'
    process.platform = require(os).platform()
  } catch (e) {}
