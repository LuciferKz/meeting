const mysql = require('mysql')
const db = mysql.createConnection({
    user: 'root',
    password: '0715.shaK',
    host: '127.0.0.1',
    port: '3306',
    database: 'test',
    timezone:"08:00"
})
db.connect()
module.exports = db