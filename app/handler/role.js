const db = require('../db/index.js')
const routes = require('./routes')

const fetchAll = function () {
    return new Promise((resolve, reject) => {
        db.query('select * from role', function (err, data) {
            if (err) reject(err)
            resolve({
                code: 20000,
                data,
                msg: '请求成功'
            })
        })
    })
}

const fetchRoutes = function () {
    return new Promise((resolve, reject) => {
        resolve({
            code: 20000,
            data: routes,
            msg: '请求成功'
        })
    })
}

module.exports = {
    fetchAll,
    fetchRoutes
}