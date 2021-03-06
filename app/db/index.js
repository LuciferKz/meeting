const mysql = require('mysql')
function connect () {
    let db;
    db = mysql.createConnection({
        user: 'root',
        password: '123456',
        host: '120.55.55.34',
        port: 3306,
        database: 'test',
        timezone: "08:00",
        useConnectionPooling: true
    })

    //连接错误，2秒重试
    db.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(connect , 2000);
        }
    })

    db.on('error', function (err) {
        console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
        } else {
            throw err;
        }
    })
    return db
}

module.exports = connect