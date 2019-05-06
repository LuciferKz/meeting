(function () {
  const _ = {
    on: function (o, evt, fn) {
      if (_.isString(o)) {
        o = document.querySelector(o)
      }
      if (document.addEventListener) {
        o.addEventListener(evt, fn)
      } else if (document.attachEvent) {
        o.attachEvent(evt, fn)
      } else {
        o['on' + evt] = fn
      }
    },
    isString: function (o) {
      return typeof o === 'string'
    },
    isArray: function (o) {
      return o instanceof Array
    }
  }

  window._ = _
} (window))

const $k = function (selector) {
  return document.querySelector(selector)
}