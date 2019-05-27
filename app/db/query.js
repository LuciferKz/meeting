const connect = require('./index')

const query = function () {
    let db = connect()
    let args = Array.from(arguments)
    let last = args[args.length - 1]
    if (typeof last !== 'function') {
        return new Promise((resolve, reject) => {
            let cb = function (err, data, fields) {
                if (err) reject(err)
                resolve(data, fields)
            }
            args.push(cb)
            db.query.apply(db, args)
        })
        .then(data => {
            db.end()
            return data
        })
        .catch(err => {
            console.log('db query', err)
            db.end()
            throw err;
        })
    } else {
        db.query.apply(db, args)
    }
}

module.exports = query