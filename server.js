const express = require('express')
const app = express()
const userRouter = require('./routes/users')

app.use(express.static('public'))
app.use(express.urlencoded( { extended: true }))
app.use(express.json())
app.use(logger)
app.set('view engine', 'ejs')

app.use('/users', userRouter)

function logger(req, res, next){
    console.log(req.originalUrl)
    next()
}

app.listen(8080)