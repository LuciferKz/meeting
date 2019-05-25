const express = require('express')
const router = express.Router()
const handler = require('../../handler')

router.post('/upload', function (req, res, next) {
  handler.meeting.upload(req, res)
})

router.get('/list', function (req, res, next) {
  handler.meeting.getMeetings(req, res)
})

module.exports = router