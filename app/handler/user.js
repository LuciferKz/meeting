const jwt = require('jwt-simple')
const crypto = require("crypto")
const sql = require('./sql.js')
const db = require('../db/index.js')

const secret = 'pingpaihuiyijilu'

const getUserByName = function (name) {
    return new Promise((resolve, reject) => {
        db.query('select * from user where username = ?', [name], function (err, data) {
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
        let msg = ''
        let status = 2
        let token = null

        if (data) {
            if (data[0].password === newPwd) {
                status = 1
                msg = '登录成功'
                token = token = jwt.encode({ username, expires: Date.now() + 2 * 60 * 60 * 1000 }, secret);
            } else {
                msg = '密码错误'
            }
        } else {
            msg = '账号不存在'
        }

        return { status, msg, token }
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
    db.query(sql.SQL_USER_INSERT, [username, newPwd, params.brandId], cb)
}

module.exports = {
    getUserByName,
    login,
    register
}