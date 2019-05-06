const express = require('express')
const router = express.Router()
const userHandler = require('../handler/user')

router.post('/login', (req, res, next) => {
    userHandler
    .login(req.body)
    .then((data) => {
        res.send(data)
    })
})

router.post('/register', function (req, res, next) {
    userHandler
    .register(req.body, (err, data) => {
        if (err) res.send({ status: 2, msg: "注册失败" })
        if (data){
            res.send({
                status: 1,
                user: {
                    id: data.insertId.id
                },
                msg: "注册成功"
            })
        }
    })
})

module.exports = router