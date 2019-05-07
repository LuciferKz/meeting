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


// sidebar__menu__item--active
(function () {
  'use strict'

  const baseUrl = 'file:///Users/zhangzhenkai/kim.zhang/private/meeting/admin'

  const routers = [{
    path: '/index.html',
    text: '首页'
  }, {
    path: '/views/user/index.html',
    text: '用户管理'
  }, {
    path: '/views/brand/index.html',
    text: '会议记录'
  }]

  let sidebar = ''
  _.each(routers, function (r, idx) {
    sidebar += '<li class="sidebar__menu__item"><a href="'+ baseUrl + r.path +'">'+ r.text +'</a></li>'
  })

  $k('.sidebar__menu').innerHTML = sidebar

  _.on($k('.arrow-down'), 'click', function () {
    $k('.user-menu').style.display = 'block'
    $k('.cover').style.display = 'block'
    _.on($k('.cover'), 'click', function () {
      $k('.user-menu').style.display = 'none'
      $k('.cover').style.display = 'none'
    })
  })
} ())

