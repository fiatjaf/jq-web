var stdin = ''
var stdout = ''
var stderr = ''

var Module = {
  noInitialRun: true,
  noExitRuntime: true,
  preRun: function () {
    FS.init(
      function input () {
        if (stdin) {
          var c = stdin[0]
          stdin = stdin.slice(1)
          return c.charCodeAt(0)
        } else return null
      },
      function output (c) {
        if (c) stdout += String.fromCharCode(c)
        else stdout += '\n'
      },
      function error (c) {
        if (c) stderr += String.fromCharCode(c)
        else stderr += '\n'
      }
    )
  }
}
