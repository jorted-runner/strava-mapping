const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('strava/index');
})

router.get('/login', (req, res) => {
    console.log("login")
})

router.get('/callback', (req, res) => {
    console.log("callback")
})

module.exports = router
