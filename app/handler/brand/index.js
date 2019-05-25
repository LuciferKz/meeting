const db = require('../../db')
const sql = require('../sql')

const getBrands = function (req, res) {
  return Promise.all([
    db.query(sql.BRAND_ALL),
    db.query(sql.COUNT_BRAND)
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
  getBrands
}