const express = require('express')
const router = express.Router()
const meetingHandler = require('../handler/meeting')
const logHandler = require('../handler/log')

const formidable = require('formidable')
const xlsx = require('node-xlsx')
const fs = require('fs')
const path = require('path')
const _ = require('../utils')

router.post('/upload', function (req, res, next) {
  const form = new formidable.IncomingForm()
  form.parse(req,function(err, fields, files){
    const sheets = xlsx.parse(fs.readFileSync(files.file.path))
    const header = sheets[0].data.splice(0, 2)[1]
    const body = _.deepClone(sheets[0].data)
    logHandler
    .create({
      username: req.body.username,
      filename: files.file.name
    })
    .then((log) => {
      meetingHandler
      .importExcel(sheets[0].data, log.insertId)
      .then((data) => {
        res.send(data)
      })
    })
  });
})

router.get('/list', function (req, res, next) {
  meetingHandler
  .getMeetings(req.query)
  .then((data) => {
    res.send(data)
  })
})

module.exports = router