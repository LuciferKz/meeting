const express = require('express')
const router = express.Router()
const roleHandler = require('../handler/role')

router.get('/all', (req, res, next) => {
    roleHandler
    .fetchAll()
    .then((data) => {
        res.send(data)
    })
})

router.get('/routes', (req, res, next) => {
    roleHandler
    .fetchRoutes()
    .then((data) => {
        res.send(data)
    })
})

module.exports = router