const mysql = require('mysql')
const db = mysql.createConnection({
    user: 'root',
    password: '0715.shaK',
    host: '127.0.0.1',
    port: '3306',
    database: 'test',
})
db.connect()
module.exports = db