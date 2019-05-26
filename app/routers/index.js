const express = require('express')
const router = express.Router()
const user = require('./user')
const role = require('./role')
const brand = require('./brand')
const meeting = require('./meeting')
const meetingRecord = require('./meeting-record')
const log = require('./log')
const handler = require('../handler')
const initialDb = require('../db')

router.use((req, res, next) => {
  if (req.url === '/user/login' || req.url === '/user/register') {
    next()
  } else {
    handler.user.auth(req, res, next)
  }
})
router.use('/user', user)
router.use('/role', role)
router.use('/meeting', meeting)
router.use('/meeting-record', meetingRecord)
router.use('/brand', brand)
router.use('/log', log)
router.use('/dashboard', function (req, res, next) {
  let db = initialDb()
  let params = req.query

  let strCondition = '';
  let condition = [];
  let conditionValues = [];
  if (params.brandId) {
    condition.push('FIND_IN_SET(?,brand_id)')
    conditionValues.push(params.brandId)
  }
  if (params.theme) {
    condition.push('meeting.theme = ?')
    conditionValues.push(params.theme)
  }
  if (params.year) {
    condition.push('year(meeting.meeting_date) = ?')
    conditionValues.push(params.year)
  }
  if (params.month) {
    condition.push('month(meeting.meeting_date) = ?')
    conditionValues.push(params.month)
  }
  if (condition.length) strCondition = 'WHERE ' + condition.join(' and ')

  console.log(strCondition)

  Promise
  .all([
    // 会议场数
    db.query('SELECT month(meeting_date) as month, count(*) as total FROM meeting_record, meeting '+ strCondition +' group by month(meeting_date);', conditionValues),
    db.query('SELECT month(meeting_date) as month, sum(attend_doctor_count) as doctorCount, sum(attend_wechat_doctors_count) as wechatDoctorCount from meeting_record as mr inner join meeting as m on m.id = mr.meeting_id '  + strCondition + ' group by month(meeting_date)', conditionValues)
  ])
  .then(data => {
    let meetings = data[0]
    let doctors = data[1]
    db.end()
    res.send({
      code: 20000,
      data: {
        meetings,
        doctors
      },
      meesage: '请求成功'
    })
  })
  .catch(err => {
    throw err
  })
})

module.exports = router