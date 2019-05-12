const db = require('../db')
const sql = require('./sql')
const moment = require('moment')

const create = function (params) {
    return db
    .query(sql.LOG_CREATE,[params.username, params.filename, 'upload', moment().format('YYYY-MM-DD HH:mm:ss')])
    .then(data => {
        return data
    })
}

module.exports = {
    create
}