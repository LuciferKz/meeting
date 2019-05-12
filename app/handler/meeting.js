const db = require('../db')
const sql = require('./sql')
const moment = require('moment')

let meetings = {}
let brands = {}
let logId = null

const createBrand = function (name) {
  console.log('开始创建品牌', name)
  return db
  .query('INSERT INTO brand ( name ) VALUES (?)', [name])
  .then(data => {
    console.log('结束创建品牌', data)
    brands[name] = { id: data.insertId }
    return brands[name]
  })
}

const getBrand = function (name) {
  console.log('开始查询品牌', name)
  if (brands[name]) {
    console.log('内存查询结果', brands[name])
    return Promise.resolve(brands[name])
  } else {
    return db
    .query('SELECT * FROM brand WHERE name = ?', [name])
    .then(data => {
      console.log('结束查询品牌')
      if (data && data.length) {
        return data[0]
      } else {
        return createBrand(name)
      }
    })
  }
}

const createMeeting = function (meeting) {
  console.log('开始创建会议', meeting[3])
  const [month, meeting_date, meeting_time, theme, brand_id, type, founder] = meeting
  return db
  .query('INSERT INTO meeting (theme, brand_id, type, founder, meeting_date, meeting_time) VALUES (?,?,?,?,?,?)', [theme, brand_id, type, founder, meeting_date, meeting_time])
  .then(data => {
    console.log('结束创建会议信息', data)
    meetings[theme] = { id: data.insertId }
    return meetings[theme]
  })
}

const getMeeting = function (meeting) {
  let theme = meeting[3]
  console.log('开始查询会议', meeting[3])
  if (meetings[theme]) {
    console.log('内存查询结果', meetings[theme])
    return Promise.resolve(meetings[theme])
  } else {
    return db
    .query('SELECT * FROM meeting WHERE theme = ?', [theme])
    .then(data => {
      console.log('结束查询会议')
      if (data && data.length) {
        return data[0]
      } else {
        return createMeeting(meeting)
      }
    })
  }
}

function* genQueue (data) {
  let current = 0
  while (current < data.length) {
    let row = data[current]
    if (row.length && row[3]) {
      yield getBrand(row[4])
      .then((brand) => {
        console.log('完成关联品牌', brand.id)
        row[4] = brand.id
        return getMeeting(row.splice(0, 7))
      })
      .then((meeting) => {
        console.log('完成关联会议', meeting.id)
        row.unshift(meeting.id)
        row[17] = null
        row[12] = moment(new Date(1900, 0, row[12] - 1)).format('YYYY-MM-DD HH:mm:ss')
        row[13] = moment(new Date(1900, 0, row[13] - 1)).format('YYYY-MM-DD HH:mm:ss')
        row.push(logId)
        return db
        .query(sql.MEETING_RECORD_INSERT, row)
        .then((data) => {
          return data
        })
      })
    }
    current++
  }
}

const importExcel = function (data, gid) {
  logId = gid
  return Promise.all([
    db.query(sql.MEETING_ALL),
    db.query(sql.BRAND_ALL)
  ])
  .then(res => {
    res[0].forEach((m) => {
      meetings[m.name] = m
    })
    res[1].forEach((b) => {
      brands[b.name] = b
    })

    const queue = genQueue(data)
    return runQueue(queue)
  })
}

const runQueue = function (queue) {
  let data = queue.next()
  if (data.done) {
    return db
    .query(sql.MEETING_RECORD_LIST + ' WHERE meeting_record.log_id = ?', [logId])
    .then(data => {
      return {
        code: 20000,
        data,
        message: '完成上传'
      }
    })
  } else {
    return data.value.then(() => {
      return runQueue(queue)
    })
  }
}

const getMeetings = function (params) {
  let page = parseInt(params.page) - 1
  let limit = parseInt(params.limit)

  return Promise.all([
    db.query('SELECT *, brand.name as brandName FROM meeting LEFT JOIN brand ON meeting.brand_id = brand.id LIMIT ?,?', [page*limit, limit]),
    db.query('SELECT count(*) as total FROM meeting')
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
  importExcel,
  getMeetings,
  getBrand
}