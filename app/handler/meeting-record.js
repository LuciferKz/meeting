const db = require('../db')
const sql = require('./sql')

const getMeetingRecords = function (params) {
  let condition = ' WHERE meeting_record.meeting_id = ?'
  let data = [params.meeting_id]

  // if (params.decoded.brand_id !== 1) {
  //   condition += ' and brand.id = ?'
  //   data.push(params.decoded.brand_id)
  // }

  return Promise.all([
      db.query(sql.MEETING_RECORD_LIST + condition, data),
      db.query('SELECT count(*) as total FROM meeting_record' + condition, data)
  ])
  .then(res => {
    return {
      code: 20000,
      data: {
        items: res[0],
        total: res[1][0].total
      },
      message: '请求成功'
    }
  })
}

module.exports = {
  getMeetingRecords
}