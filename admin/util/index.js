(function () {
  const _ = {
    on: function (o, evt, fn) {
      if (!o) throw new Error('对象不存在')
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
    },
    each: function (o, fn) {
      if (typeof o === 'object') {
        if (o instanceof Array) {
          if (o.forEach) {
            o.forEach(fn)
          } else {
            for (let i = 0; i < o.length; i++) {
              fn(o[i], i)
            }
          }
        }
      }
    }
  }

  window._ = _
} (window))

const $k = function (selector) {
  return document.querySelector(selector)
}

const createMessageBox = function (msg) {
  const messageBox = document.createElement('div')
  messageBox.className = "message-box"
  messageBox.innerHTML = msg
  return messageBox
}

const $message = {
  show (msg) {
    const messageBox = createMessageBox(msg)
    const body = document.querySelector('body')
    body.append(messageBox)
    messageBox.classList.add('fade-in')
    setTimeout(function () {
      messageBox.classList.add('fade-out')
    }, 2500)
    setTimeout(function () {
      messageBox.parentNode.removeChild(messageBox)
    }, 3000)
  }
};
