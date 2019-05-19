const express = require('express')
const router = express.Router()
const brandHandler = require('../handler/brand')

router.get('/list', function (req, res, next) {
  brandHandler
  .getBrands(req.query)
  .then((data) => {
    res.send(data)
  })
})

module.exports = router