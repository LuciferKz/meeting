const db = require('../../db')
const routes = require('./routes')

const fetchAll = function (req, res) {
    return db
    .query('select * from role')
    .then(data => {
        res.send({
            code: 20000,
            data,
            message: '请求成功'
        })
    })
}

const fetchRoutes = function (req, res) {
    return res.send({
        code: 20000,
        data: routes,
        message: '请求成功'
    })
}

module.exports = {
    fetchAll,
    fetchRoutes
}