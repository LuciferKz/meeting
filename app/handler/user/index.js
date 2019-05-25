const jwt = require('jwt-simple')
const crypto = require("crypto")
const sql = require('../sql.js')
const db = require('../../db')
const moment = require('moment')

const secret = 'pingpaihuiyijilu'

const info = function (req, res) {
  const params = req.query
  let username = params.decoded.username ? params.decoded.username : jwt.decode(params.token, secret).username
  return db
  .query(sql.USER_JOIN_BRAND + ' where `user`.username = ?', [username])
  .then((data) => {
    if (data && data[0]) {
      delete data.password
      res.send({
        code: 20000,
        data: data[0],
        message: '请求成功'
      })
    } else {
      res.send({
        code: 20000,
        data: {},
        message: '用户不存在'
      })
    }
  })
}

const getUserByName = function (name) {
  return db
  .query(sql.USER_ALL + ' where `user`.username = ?', [name])
  .then(data => {
    return data ? data[0] : null
  })
}

const getUsers = function (req, res) {
  const params = req.query
  let page = parseInt(params.page) - 1
  let limit = parseInt(params.limit)
  return Promise.all([
    db.query(sql.USER_LIST, [page*limit, limit]),
    db.query(sql.COUNT_USER)
  ])
  .then(data => {
    res.send({
      code: 20000,
      data: {
          items: data[0],
          total: data[1][0].total
      },
      message: '获取成功'
    })
  })
}

const login = function (req, res) {
  const params = req.body
  let username = params.username
  let password = params.password
  let md5 = crypto.createHash("md5")
  let newPwd = md5.update(password).digest("hex")
  return getUserByName(username)
  .then((data) => {
    let message = ''
    let code = 2
    let token = null

    if (data) {
      if (data.password === newPwd) {
        code = 20000
        message = '登录成功'
        // 2 * 60 * 60 * 1000
        const expires = 2 * 60 * 60 * 1000
        token = jwt.encode({ username, brand_id: data.brand_id, roles: data.roles, expires: Date.now() + expires }, secret);
      } else {
        message = '密码错误'
      }
    } else {
      message = '账号不存在'
    }

    res.send({ code, message, data: { token } })
  })
}

const logout = function (req, res) {
  res.send({
    code: 20000,
    message: '成功登出！'
  })
}

const auth = function (req, res, next) {
  let token = req.headers['x-token']
  let decoded = {}
  let code = 20000
  let message = ''
  if (!token) {
    code = 50008
    message = '用户未登录！'
  } else {
    try {
      decoded = jwt.decode(token, secret)
      if (Date.now() > decoded.expires) {
        code = 50014
        message = '登录超时！'
      }
    } catch (err) {
      // console.log(err)
      code = 50008
      message = 'Token不合理！'
    }
  }
  if (code !== 20000) {
    res.send({
      code,
      message
    })
  } else {
    if (req.query) req.query.decoded = decoded
    if (req.body) req.body.decoded = decoded
    next()
  }
}

const create = function (req, res) {
  const params = req.body
  let username = params.username
  if (password.length) {
    res.send({
      code: 20002,
      message: '用户名长度不能小于6'
    })
    return false
  }
  let password = params.password
  if (password.length) {
    res.send({
      code: 20002,
      message: '密码长度不能小于6'
    })
    return false
  }
  let md5 = crypto.createHash("md5")
  let newPwd = md5.update(password).digest("hex");
  return db
  .query(sql.USER_INSERT, [username, newPwd, params.brandId, moment().format('YYYY-MM-DD HH:MM:SS'), moment().format('YYYY-MM-DD HH:MM:SS')])
  .then(data => {
    if (data) {
      res.send({
        code: 20000,
        data: {
          user: {
            id: data.insertId
          },
        },
        message: "新建成功"
      })
    } else {
      res.send({
        code: 20002,
        message: "创建失败"
      })
    }
  })
}

const deleteUser = function (req, res) {
  const params = req.body
  return db
  .query('DELETE user WHERE id = ?', [params.id])
  .then(data => {
    res.send({
      code: 20000,
      message: "删除成功"
    })
  })
}

module.exports = {
    getUserByName,
    getUsers,
    login,
    logout,
    create,
    info,
    auth,
    deleteUser
}
