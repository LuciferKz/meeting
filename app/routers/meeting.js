const express = require('express')
const router = express.Router()
const meetingHandler = require('../handler/meeting')

router.post('/upload', function (req, res, next) {
  const form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.uploadDir = 'public/upload/'
  form.keepExtensions = true
  form.maxFieldsSize = 10 * 1024 * 1024

  form.parse(req, function(err, fields, files) {
    const sheets = xlsx.parse(files.excel.path)
    fs.unlink(files.excel.path)
    res.send(sheets)
  })
})