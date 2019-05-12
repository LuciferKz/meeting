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


const query = db.query
db.query = function () {
    let args = Array.from(arguments)
    let last = args[args.length - 1]
    if (typeof last !== 'function') {
        return new Promise((resolve, reject) => {
            let cb = function (err, data, fields) {
                if (err) return reject(err)
                resolve(data, fields)
            }
            args.push(cb)
            query.apply(db, args)
        })
        .catch(err => {
            console.log(err)
        })
    } else {
        query.apply(db, args)
    }
}

module.exports = db