const initializeDb = require('../../db');
const sql = require('../sql');
const moment = require('moment');
const query = require('../../db/query');

let db;

const create = function (params) {
    // db = initializeDb()
    return query(sql.LOG_CREATE,[params.username, params.filename, 'upload', moment().format('YYYY-MM-DD HH:mm:ss')])
}
const fetchList = function (req, res) {
    // db = initializeDb()
    const params = req.query
    let page = parseInt(params.page) - 1
    let limit = parseInt(params.limit)

    return Promise.all([
      query(sql.LOG_ALL, [page*limit, limit]),
      query(sql.COUNT_LOG)
    ])
    .then(data =>　{
      // db.end()
      res.send({
          code: 20000,
          data: {
            items: data[0],
            total: data[1][0].total
          },
          message: '获取成功'
      })
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}

module.exports = {
    create,
    fetchList
}