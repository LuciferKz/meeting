const db = require('../../db')
const sql = require('../sql')
const moment = require('moment')

const create = function (params) {
    return db.query(sql.LOG_CREATE,[params.username, params.filename, 'upload', moment().format('YYYY-MM-DD HH:mm:ss')])
}
const fetchList = function (req, res) {
    const params = req.query
    let page = parseInt(params.page) - 1
    let limit = parseInt(params.limit)

    return Promise.all([
      db.query(sql.LOG_ALL, [page*limit, limit]),
      db.query(sql.COUNT_LOG)
    ])
    .then(data =>　{
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

module.exports = {
    create,
    fetchList
}