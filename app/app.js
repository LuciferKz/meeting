const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const routers = require('./routers/index')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.use(routers)

module.exports = app