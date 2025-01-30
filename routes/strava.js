const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("Hello strava mapping homepage")
})

router.get('/login', (req, res) => {
    console.log("login")
})

router.get('/callback', (req, res) => {
    console.log("callback")
})

module.exports = router
