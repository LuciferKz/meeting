const initializeDb = require('../../db')
const sql = require('../sql')

let db;

const getBrands = function (req, res) {
  db = initializeDb()
  return Promise.all([
    db.query(sql.BRAND_ALL),
    db.query(sql.COUNT_BRAND)
  ])
  .then(data =>　{
    db.end()
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
  getBrands
}