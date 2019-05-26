const initializeDb = require('../../db');
const sql = require('../sql');

let db;

const getMeetingRecords = function (req, res) {
  let params = req.query
  let condition = ' WHERE meeting_record.meeting_id = ?'
  let data = [params.meeting_id]

  db = initializeDb()
  return Promise.all([
      db.query(sql.MEETING_RECORD_LIST + condition, data),
      db.query('SELECT count(*) as total FROM meeting_record' + condition, data)
  ])
  .then(data => {
    db.end()
    res.send({
      code: 20000,
      data: {
        items: data[0],
        total: data[1][0].total
      },
      message: '请求成功'
    })
  })
  .catch(err => {
    console.log(err)
    throw err
  })
}

module.exports = {
  getMeetingRecords
}