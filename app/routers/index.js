const express = require('express')
const router = express.Router()
const user = require('./user')
const role = require('./role')
const brand = require('./brand')
const meeting = require('./meeting')
const meetingRecord = require('./meeting-record')
const handler = require('../handler')

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

module.exports = router