const handler = {
    brand: require('./brand'),
    log: require('./log'),
    meeting: require('./meeting'),
    meetingRecord: require('./meeting-record'),
    role: require('./role'),
    user: require('./user')
}

for (let module in handler) {
    let _handler = handler[module]
    for (let name in _handler) {
        let originHandler = _handler[name]
        _handler[name] = function (req, res, next) {
            try {
                originHandler(req, res, next)
            } catch(err) {
                var errorMsg
                    = '\n'
                    + 'Error ' + new Date().toISOString() + ' ' + req.url
                    + '\n'
                    + err.stack || err.message || 'unknow error'
                    + '\n'
                    ;
                
                console.error(errorMsg);
                res.end('<pre>' + errorMsg + '</pre>');
            }
        }
    }
}

module.exports = handler