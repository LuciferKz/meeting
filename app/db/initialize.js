const connect = require('./index')

const initializeDb = function () {
    const db = connect()
    const originQuery = db.query
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
                originQuery.apply(db, args)
            })
            .catch(err => {
                console.log('db query', err)
                throw err;
            })
        } else {
            originQuery.apply(db, args)
        }
    }
    return db
}

module.exports = initializeDb