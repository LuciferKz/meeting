const meetingRecordHandler = require('../handler/meeting-record')
const express = require('express')
const router = express.Router()

router.get('/list', (req, res, next) => {
    meetingRecordHandler
    .getMeetingRecords(req.query)
    .then(data => {
        res.send(data)
    })
})

module.exports = router