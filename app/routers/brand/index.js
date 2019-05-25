const express = require('express')
const router = express.Router()
const handler = require('../../handler')

router.get('/list', function (req, res, next) {
  handler.brand.getBrands(req, res)
})

module.exports = router