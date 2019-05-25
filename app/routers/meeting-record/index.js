const express = require('express')
const router = express.Router()
const handler = require('../../handler')

router.get('/list', (req, res, next) => {
    handler.meetingRecord.getMeetingRecords(req, res)
})

module.exports = router