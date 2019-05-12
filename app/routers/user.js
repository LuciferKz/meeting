const express = require('express')
const router = express.Router()
const userHandler = require('../handler/user')

router.use((req, res, next) => {
    let token = req.headers['x-token']
    if (req.url === '/login' || req.url === '/register') {
        next()
    } else {
        userHandler
        .auth(token)
        .then((data, decoded) => {
            if (data.code !== 20000) {
                res.send(data)
            } else {
                if (res.query) res.query.username = decoded.username
                else if (res.body) res.body.username = decoded.username
                next()
            }
        })
    }
})

router.post('/login', (req, res, next) => {
    userHandler
    .login(req.body)
    .then((data) => {
        res.send(data)
    })
})

router.post('/logout', (req, res, next) => {
    userHandler
    .logout()
    .then(() => {
        res.send({
            code: 20000,
            message: '成功登出！'
        })
    })
})

router.post('/register', function (req, res, next) {
    userHandler
    .register(req.body)
    .then((data) => {
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

router.get('/info', (req, res, next) => {
    userHandler
    .info(req.query.token)
    .then((data) => {
        res.send(data)
    })
})

module.exports = router