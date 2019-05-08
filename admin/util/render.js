// sidebar__menu__item--active
(function () {
  'use strict'

  const baseUrl = 'http://120.55.55.34:3031'

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