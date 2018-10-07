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
  var initialized = false
  var initListeners = []

  var stdin = ''
  var inBuffer = []
  var outBuffer = []
  var errBuffer = []

  function toByteArray (str) {
    var byteArray = []
    const encodedStr = unescape(encodeURIComponent(str))
    for (var i = 0; i < encodedStr.length; i++) {
      byteArray.push(encodedStr.charCodeAt(i));
    }
    return byteArray
  }

  function fromByteArray (data) {
    var array = new Uint8Array(data)
    var str = ''
    for(var i = 0; i < array.length; ++i) {
      str += String.fromCharCode(array[i])
    }
    return decodeURIComponent(escape(str))
  }

  var Module = {
    noInitialRun: true,
    noExitRuntime: true,
    onRuntimeInitialized: function () {
      initialized = true
      initListeners.forEach(function (cb) {
        cb()
      })
    },
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
