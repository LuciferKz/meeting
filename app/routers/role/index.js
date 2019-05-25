const express = require('express')
const router = express.Router()
const handler = require('../../handler')

router.get('/all', (req, res, next) => {
    handler.role.fetchAll(req, res)
})

router.get('/routes', (req, res, next) => {
    handler.role.fetchRoutes(req, res)
})

module.exports = router