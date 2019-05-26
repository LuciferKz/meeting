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
  Promise
  .all([
    // 会议场数
    db.query('SELECT month(meeting_date) as meeting_month, count(*) as total FROM test.meeting group by month(meeting_date);')
  ])
  .then(data => {
    let meetings = data[0]
    res.send({
      code: 20000,
      data: {
        meetings
      },
      meesage: '请求成功'
    })
  })
  .catch(err => {
    throw err
  })
})

module.exports = router