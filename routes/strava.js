const express = require('express')
const router = express.Router()
const axios = require('axios');

var stravaData = null

router.get('/', (req, res) => {
    res.render('strava/index');
})

// Redirect user to Strava authorization URL
router.get('/login', (req, res) => {
    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.clientId}&response_type=code&redirect_uri=http://localhost:8080/strava/callback&approval_prompt=force&scope=read`;

    res.redirect(authUrl);
});

// Handle callback from Strava and exchange code for access token
router.get('/callback', async (req, res) => {
    const { code } = req.query; // Strava sends back an authorization code

    if (!code) {
        return res.status(400).send("No authorization code received.");
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post(
					'https://www.strava.com/oauth/token',
					{
						client_id: process.env.clientId,
						client_secret: process.env.clientSecret,
						code: code,
						grant_type: 'authorization_code',
					}
				);
        stravaData = tokenResponse.data
        console.log("Access Token Response:", stravaData);

        res.render('strava/index', { loggedIn: true });
    } catch (error) {
        console.error("Error getting access token:", error.response?.data || error.message);
        res.status(500).send("Failed to get access token.");
    }
});

router.get('/token', (req, res) => {
    if (!stravaData) {
        return res.status(404).send("Token not found.")
    } else {
        res.status(200).json(stravaData)
    }
})

module.exports = router
