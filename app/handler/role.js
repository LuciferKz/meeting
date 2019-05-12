const db = require('../db/index.js')
const routes = require('./routes')

const fetchAll = function () {
    return db
    .query('select * from role')
    .then(data => {
        resolve({
            code: 20000,
            data,
            message: '请求成功'
        })
    })
}

const fetchRoutes = function () {
    return Promise.resolve({
        code: 20000,
        data: routes,
        message: '请求成功'
    })
}

module.exports = {
    fetchAll,
    fetchRoutes
}