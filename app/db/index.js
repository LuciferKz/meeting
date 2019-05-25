const mysql = require('mysql')
let db;
function handleError () {
    db = mysql.createConnection({
        user: 'root',
        password: '123456',
        host: '120.55.55.34',
        port: 3306,
        database: 'test',
        timezone: "08:00"
    })

    //连接错误，2秒重试
    db.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleError , 2000);
        }
    })

    db.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    })

    const query = db.query
    db.query = function () {
        let args = Array.from(arguments)
        let last = args[args.length - 1]
        if (typeof last !== 'function') {
            return new Promise((resolve, reject) => {
                let cb = function (err, data, fields) {
                    if (err) reject(err)
                    resolve(data, fields)
                }
                args.push(cb)
                query.apply(db, args)
            })
            .catch(err => {
                throw err;
            })
        } else {
            query.apply(db, args)
        }
    }
}
handleError()

module.exports = db