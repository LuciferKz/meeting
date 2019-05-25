const express = require('express')
const router = express.Router()
const handler = require('../../handler')

router.get('/list', function (req, res, next) {
  handler.log.fetchList(req, res)
})

module.exports = router