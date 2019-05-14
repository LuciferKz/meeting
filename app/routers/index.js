const express = require('express')
const router = express.Router()
const user = require('./user')
const role = require('./role')
const meeting = require('./meeting')
const meetingRecord = require('./meeting-record')
const userHandler = require('../handler/user')

router.use((req, res, next) => {
    let token = req.headers['x-token']
    if (req.url === '/user/login' || req.url === '/user/register') {
        next()
    } else {
        userHandler
        .auth(token)
        .then((data) => {
            if (data.code !== 20000) {
                res.send(data)
            } else {
                if (req.query) req.query.decoded = data.data
                if (req.body) req.body.decoded = data.data
                next()
            }
        })
    }
})
router.use('/user', user)
router.use('/role', role)
router.use('/meeting', meeting)
router.use('/meeting-record', meetingRecord)

module.exports = router