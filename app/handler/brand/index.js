const initializeDb = require('../../db');
const sql = require('../sql');
const query = require('../../db/query');

let db;

const getBrands = function (req, res) {
  // db = initializeDb()
  return Promise.all([
    query(sql.BRAND_ALL),
    query(sql.COUNT_BRAND)
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
  getBrands
}