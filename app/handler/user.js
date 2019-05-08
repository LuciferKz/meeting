const jwt = require('jwt-simple')
const crypto = require("crypto")
const sql = require('./sql.js')
const db = require('../db/index.js')
const moment = require('moment')

const secret = 'pingpaihuiyijilu'

const getUserByName = function (name) {
    return new Promise((resolve, reject) => {
        db.query('select * from user where username = ?', [name], function (err, data) {
            if (err) reject(err)
            resolve(data)
        })
    })
}

const getUsers = function (params) {
    let offset = parseInt(params.offset)
    let limit = parseInt(params.limit)
    return new Promise((resolve, reject) => {
        db.query('SELECT `user`.id, `user`.username, `brand`.name as brandName, `user`.createAt, `user`.updateAt FROM user LEFT JOIN brand ON user.brand = brand.id LIMIT ?,?', [offset, limit], function (err, data) {
            if (err) reject(err)
            resolve(data)
        })
    })
}

const login = function (params, cb) {
    let username = params.username
    let password = params.password
    let md5 = crypto.createHash("md5")
    let newPwd = md5.update(password).digest("hex")
    return getUserByName(username)
    .then((data) => {
        let message = ''
        let status = 2
        let token = null

        if (data) {
            if (data[0].password === newPwd) {
                status = 1
                message = '登录成功'
                token = token = jwt.encode({ username, expires: Date.now() + 2 * 60 * 60 * 1000 }, secret);
            } else {
                message = '密码错误'
            }
        } else {
            message = '账号不存在'
        }

        return { status, message, data: { token } }
    })
    .catch((err) => {
        throw err
    })
}

const register = function (params, cb) {
    let username = params.username
    let password = params.password
    let md5 = crypto.createHash("md5")
    let newPwd = md5.update(password).digest("hex");
    db.query(sql.SQL_USER_INSERT, [username, newPwd, params.brandId, moment().format('YYYY-MM-DD HH:MM:SS'), moment().format('YYYY-MM-DD HH:MM:SS')], cb)
}

module.exports = {
    getUserByName,
    getUsers,
    login,
    register,
}