const express = require('express')
const router = express.Router()
const handler = require('../../handler')

router.post('/login', (req, res, next) => {
  handler.user.login(req, res)
})

router.post('/logout', (req, res, next) => {
  handler.user.logout(req, res)
})

router.post('/create', function (req, res, next) {
  handler.user.create(req, res)
})

router.post('/delete', function (req, res, next) {
  handler.user.deleteUser(req, res)
})

router.get('/list', (req, res, next) => {
  handler.user.getUsers(req, res)
})

router.get('/info', (req, res, next) => {
  handler.user.info(req, res)
})

module.exports = router