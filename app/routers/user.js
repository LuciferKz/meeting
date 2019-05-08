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
        if (err) {
            console.log(err)
            res.send({ code: 2, message: "注册失败" })
        }
        if (data){
            res.send({
                code: 20000,
                data: {
                    user: {
                        id: data.insertId.id
                    },
                },
                message: "注册成功"
            })
        }
    })
})

router.get('/list', (req, res, next) => {
    userHandler
    .getUsers(req.query)
    .then((data) => {
        res.send({
            code: 20000,
            data,
            message: '获取成功'
        })
    })
})

module.exports = router