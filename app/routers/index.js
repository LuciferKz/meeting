const express = require('express')
const router = express.Router()
const user = require('./user')
const role = require('./role')
const meeting = require('./meeting')

router.use('/user', user)
router.use('/role', role)
router.use('/meeting', meeting)

module.exports = router