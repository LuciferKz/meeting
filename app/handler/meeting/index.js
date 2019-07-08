const sql = require('../sql');
const moment = require('moment');
const formidable = require('formidable');
const xlsx = require('node-xlsx');
const fs = require('fs');
const initialize = require('../../db/initialize');
const connect = require('../../db/index')

let meetingMaps = {};
let brandMaps = {};
let logId = null;
let db;

const createRelationBrandMeeting = function (brandId, meetingId) {
  return db.query('INSERT IGNORE INTO relation_brand_meeting (brand_id,meeting_id,relation_key) VALUES (?,?,?)', [brandId, meetingId, `${brandId}_${meetingId}`])
}

const createBrand = function (name) {
  // console.log('开始创建品牌', name)
  return db.query('INSERT INTO brand ( name ) VALUES (?)', [name])
  .then(data => {
    // console.log('结束创建品牌', name, data)
    if (data) {
      brandMaps[name] = { id: data.insertId }
      return brandMaps[name]
    }
  })
}

const getBrand = function (name) {
  // console.log('开始查询品牌', name)
  if (brandMaps[name]) {
    // console.log('内存查询结果', brandMaps[name])
    return Promise.resolve(brandMaps[name]);
  } else {
    return db.query('SELECT * FROM brand WHERE name = ?', [name])
    .then(data => {
      // console.log('结束查询品牌')
      if (data && data.length) {
        return data[0];
      } else {
        return createBrand(name);
      }
    })
  }
}

const createMeeting = function (meeting) {
  // console.log('开始创建会议', meeting[3])
  const [month, meeting_date, meeting_time, theme, brands, type, founder] = meeting;
  return db.query('INSERT INTO meeting (theme, brands, type, founder, meeting_date, meeting_time) VALUES (?,?,?,?,?,?)', [theme, brands, type, founder, meeting_date, meeting_time])
  .then(data => {
    // console.log('结束创建会议信息', data)
    if (data) {
      meetingMaps[theme] = { id: data.insertId };
      return meetingMaps[theme];
    }
  })
}

const getMeeting = function (meeting) {
  let theme = meeting[3]
  // console.log('开始查询会议', meeting[3])
  if (meetingMaps[theme]) {
    // console.log('内存查询结果', meetingMaps[theme])
    return Promise.resolve(meetingMaps[theme]);
  } else {
    return db.query('SELECT * FROM meeting WHERE theme = ?', [theme])
    .then(data => {
      // console.log('结束查询会议')
      if (data && data.length) {
        return data[0];
      } else {
        return createMeeting(meeting);
      }
    })
  }
}

function checkData (data) {
  let code = 20000
  let message = null
  let newDate = []
  for (let i = 0, len = data.length; i < len; i++) {
    let row = data[i]
    if (row.length) {
      let meeting = row[3]
      let brand = row[4]
      if (!meeting) {
        code = 20004
        message = '有记录缺失主题'
      } else if (!brand) {
        code = 20004
        message = '有记录缺失品牌'
      }
      newDate.push(row)
    }
  }
  return { code, data: newDate, message }
}

function* genQueue (data) {
  let current = 0;
  while (current < data.length) {
    let row = data[current];
    const brandNames = row[4].split(',');
    let brandIds = [];
    yield Promise.all(
      brandNames.map(name => getBrand(name))
    ).then((brands) => {
      // console.log('完成关联品牌', brands)
      brandIds = brands.map(b => b.id);
      return getMeeting(row.splice(0, 7));
    })
    .then((meeting) => {
      // console.log('完成关联会议', meeting.id)
      row.unshift(brandIds.join(','));
      row.unshift(meeting.id);
      
      let proms = [];
      brandIds.forEach(bid => {
        proms.push(createRelationBrandMeeting(bid, meeting.id));
      })
      return proms.length ? Promise.all([proms]) : true;
    })
    .then(() => {
      row[18] = row[18] || null;
      row[13] = row[13] ? moment(new Date(1900, 0, row[13] - 1)).format('YYYY-MM-DD HH:mm:ss') : null;
      row[14] = row[14] ? moment(new Date(1900, 0, row[14] - 1)).format('YYYY-MM-DD HH:mm:ss') : null;
      row.push(logId);
      return db.query(sql.MEETING_RECORD_INSERT, row);
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
    current++;
  }
}

const importExcel = function (data, gid) {
  const result = checkData(data)
  if (result.code !== 20000) {
    return Promise.resolve(result)
  }
  logId = gid
  return Promise.all([
    db.query(sql.MEETING_ALL),
    db.query(sql.BRAND_ALL),
    db.query(sql.RELATION_BRAND_MEETING_ALL),
  ])
  .then(res => {
    res[0].forEach((m) => {
      meetingMaps[m.name] = m
    })
    res[1].forEach((b) => {
      brandMaps[b.name] = b
    })
    const queue = genQueue(result.data)
    return runQueue(queue)
  })
  .catch(err => {
    console.log(err)
    throw err
  })
}

const runQueue = function (queue) {
  let data = queue.next();
  if (data.done) {
    return db.query(sql.MEETING_RECORD_LIST + ' WHERE meeting_record.log_id = ?', [logId])
    .then(data => {
      return {
        code: 20000,
        data,
        message: '完成上传'
      }
    })
  } else {
    return data.value.then(() => {
      return runQueue(queue);
    })
  }
}

const getMeetings = function (req, res) {
  db = initialize()
  let params = req.query
  let page = parseInt(params.page) - 1
  let limit = parseInt(params.limit)
  let whereParams = []
  let brandId = params.decoded.brand_id !== 1 ? params.decoded.brand_id : params.brandId
  let year = params.year
  let month = params.month
  let conditionQuery = []
  let conditionDb = ''

  if (brandId) {
    conditionDb = ' FROM meeting as m, relation_brand_meeting as rbm'
    conditionQuery = ['m.id = rbm.meeting_id', 'rbm.brand_id = ?']
    whereParams.push(brandId)
  } else {
    conditionDb = ' FROM meeting as m'
    whereParams = []
  }

  if (year) {
    conditionQuery.push('year(m.meeting_date) = ?')
    whereParams.push(year)
  }

  if (month) {
    conditionQuery.push('month(m.meeting_date) in (?)')
    whereParams.push(month)
  }

  if (conditionQuery.length) {
    conditionDb = conditionDb + ' WHERE '
  }

  conditionQuery = conditionQuery.join(' and ')

  return Promise.all([
    db.query('SELECT m.id as id, m.brands, m.theme, m.meeting_time, m.meeting_date, m.type, m.founder' + conditionDb + conditionQuery + ' ORDER BY m.meeting_date desc LIMIT ?,?', [...whereParams, page*limit, limit]),
    db.query('SELECT count(*) as total' + conditionDb + conditionQuery, [...whereParams])
  ])
  .then(data => {
    let meetings = data[0];
    let total = data[1][0].total;
    db.end()
    res.send({
      code: 20000,
      data: {
        items: meetings,
        total
      },
      message: '请求成功'
    })
  })
  .catch(err => {
    console.log(err)
    throw err
  })
}

const upload = function (req, res) {
  db = connect()
  const originQuery = db.query
  db.query = function () {
      let args = Array.from(arguments)
      let last = args[args.length - 1]
      if (typeof last !== 'function') {
        return new Promise((resolve, reject) => {
          let cb = function (err, data, fields) {
            // console.log(err, data, fields)
            if (err) reject(err)
            resolve(data, fields)
          }
          args.push(cb)
          originQuery.apply(db, args)
        })
        .catch(err => {
          db.rollback(function (err) {
            // db.end();
            if (err) {
              console.log("transaction error: " + err)
              throw err
            }
          });
          console.log('db query', err)
          throw err;
        })
      } else {
        originQuery.apply(db, args)
      }
  }

  const form = new formidable.IncomingForm()
  form.parse(req,function(err, fields, files){
    const sheets = xlsx.parse(fs.readFileSync(files.file.path))
    sheets[0].data.splice(0, 2)[1]
    const params = {
      username: req.body.decoded.username,
      filename: files.file.name
    }
    db.beginTransaction(err => {
      if (err) throw err
      db.query(sql.LOG_CREATE,[params.username, params.filename, 'upload', moment().format('YYYY-MM-DD HH:mm:ss')])
      .then((log) => {
        if (log) {
          importExcel(sheets[0].data, log.insertId)
          .then((data) => {
            db.commit((err) => {
              if (err) throw err
              console.log('数据导入完成')
              db.end()
              res.send(data)
            })
          })
        } else {
          db.end()
          res.send({
            code: 20002,
            message: '日志生成失败'
          })
        }
      })
    })
  })
}

module.exports = {
  getMeetings,
  upload
}