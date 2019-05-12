const jwt = require('jwt-simple')
const crypto = require("crypto")
const sql = require('./sql.js')
const db = require('../db/index.js')
const moment = require('moment')

const secret = 'pingpaihuiyijilu'

const info = function (token) {
    let decoded = jwt.decode(token, secret)
    return db
    .query(sql.SQL_USER_INFO, [decoded.username])
    .then((data) => {
        return ({
            code: 20000,
            data: data ? data[0] : {},
            message: '请求成功'
        })
    })
}

const getUserByName = function (name) {
    return db
    .query('select * from user where username = ?', [name])
}

const getUsers = function (params) {
    let offset = parseInt(params.offset)
    let limit = parseInt(params.limit)
    return db
    .query(sql.SQL_USER_LIST, [offset, limit])
}

const login = function (params, cb) {
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
            if (data[0].password === newPwd) {
                code = 20000
                message = '登录成功'
                // 2 * 60 * 60 * 1000
                token = jwt.encode({ username, expires: Date.now() + 2 * 60 * 60 * 1000 }, secret);
            } else {
                message = '密码错误'
            }
        } else {
            message = '账号不存在'
        }

        return { code, message, data: { token } }
    })
}

const logout = function () {
    return Promise.resolve(true)
}

const auth = function (token) {
    let decoded = {}
    let code = 20000
    let message = ''
    if (!token) {
        code = 50008
        message = '用户未登录！'
    } else {
        decoded = jwt.decode(token, secret)
        if (decoded) {
            if (Date.now() > decoded.expires) {
                code = 50014
                message = '登录超时！'
            }
        } else {
            code = 50008
            message = 'Token不合理！'
        }
    }
    return Promise.resolve({
        code,
        message
    }, decoded)
}

const register = function (params) {
    let username = params.username
    let password = params.password
    let md5 = crypto.createHash("md5")
    let newPwd = md5.update(password).digest("hex");
    return db
    .query(sql.SQL_USER_INSERT, [username, newPwd, params.brandId, moment().format('YYYY-MM-DD HH:MM:SS'), moment().format('YYYY-MM-DD HH:MM:SS')])
}

module.exports = {
    getUserByName,
    getUsers,
    login,
    logout,
    register,
    info,
    auth
}
