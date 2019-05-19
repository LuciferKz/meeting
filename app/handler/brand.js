const db = require('../db')
const sql = require('./sql')

const getBrands = function () {
  return Promise.all([
    db.query(sql.BRAND_ALL),
    db.query(sql.COUNT_BRAND)
  ])
  .then(res =>　{
    return {
        code: 20000,
        data: {
          items: res[0],
          total: res[1][0].total
        },
        message: '获取成功'
    }
  })
}

module.exports = {
  getBrands
}