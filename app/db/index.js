const mysql = require('mysql')
const db = mysql.createConnection({
    user: 'root',
    password: '123456',
    host: '120.55.55.34',
    port: '3306',
    database: 'test',
    timezone: "08:00"
})
db.connect()
module.exports = db