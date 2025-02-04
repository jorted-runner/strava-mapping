const express = require('express')
const router = express.Router()
const axios = require('axios');

var stravaData = null

// build default strava page
router.get('/', (req, res) => {
    // check if app has stored strava data and if it does pass some of the data to the front end html
    if (stravaData) {
        res.render('strava/index', {
					loggedIn: true,
					firstName: stravaData.athlete.firstname,
					lastName: stravaData.athlete.lastname,
					apiKEY: process.env.googleAPI,
				});
    } else {
        res.render('strava/index');
    }
})

// Redirect user to Strava authorization URL
router.get('/login', (req, res) => {
    const authUrl = `http://www.strava.com/oauth/authorize?client_id=${process.env.clientId}&response_type=code&redirect_uri=http://localhost:8080/strava/callback&approval_prompt=force&scope=read,activity:read`;

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

        res.redirect('/strava');
    } catch (error) {
        console.error("Error getting access token:", error.response?.data || error.message);
        res.status(500).send("Failed to get access token.");
    }
});

// Fetch last 20 activities from Strava
router.get('/20activities', async (req, res) => {
    try {
        if (!stravaData) {
            return res.status(401).send("Strava access token not found. Please authenticate.");
        }
        const activitiesResponse = await axios.get(
            'https://www.strava.com/api/v3/athlete/activities',
            {
                headers: { Authorization: `Bearer ${stravaData.access_token}` },
                params: { page: 1, per_page: 20 }
            }
        );
        res.json(activitiesResponse.data);
    } catch (error) {
        console.error("Error fetching activities:", error.response?.data || error.message);
        res.status(500).send("Failed to retrieve activities.");
    }
});

// Fetch starred segments
router.get('/starredsegments', async (req, res) => {
    try {
        if (!stravaData) {
            return res
                .status(401)
                .send('Strava access token not found. Please authenticate.');
        }
        // Make request to strava to get list of starred segments
        const segmentsResponse = await axios.get(
            'https://www.strava.com/api/v3/segments/starred',
            {
                headers: { Authorization: `Bearer ${stravaData.access_token}` },
                params: { page: 1, per_page: 50 },
            }
        );
        // Process list of starred segments - get more detailed information about each starred segment to allow it to be displayed
        const rawData = segmentsResponse.data;
        const detailedSegments = await Promise.all(
            rawData.map(async (segment) => {
                const segmentResponse = await axios.get(
                `https://www.strava.com/api/v3/segments/${segment.id}`,
                {
                    headers: { Authorization: `Bearer ${stravaData.access_token}` }
                });
                return segmentResponse.data
            })
        );
        res.json(detailedSegments);
    } catch (error) {
        console.error('Error fetching starred segments:', error.response?.data || error.message);
        res.status(500).send('Failed to retrieve starred segments.');
    }
});

// Fetch all activities from specified time period - limited to 50 activities
router.get('/activities', async (req, res) => {
	try {
		// Extract start and end dates from query parameters
		const { start, end } = req.query;

		if (!start || !end) {
			return res.status(400).send('Missing start or end date.');
		}

		// Convert start and end dates to Unix timestamps (seconds)
		const afterTimestamp = Math.floor(new Date(start).getTime() / 1000);
		const beforeTimestamp = Math.floor(new Date(end).getTime() / 1000);

		// Ensure Strava access token is available
		if (!stravaData || !stravaData.access_token) {
			return res
				.status(401)
				.send('Strava access token not found. Please authenticate.');
		}

		// Make request to Strava API
		const response = await axios.get(
			'https://www.strava.com/api/v3/athlete/activities',
			{
				headers: {
					Authorization: `Bearer ${stravaData.access_token}`,
				},
				params: {
					after: afterTimestamp, // Filter activities after this timestamp
					before: beforeTimestamp, // Filter activities before this timestamp
					page: 1,
					per_page: 50, // Adjust if needed
				},
			}
		);

		res.json(response.data);
	} catch (error) {
		console.error(
			'Error fetching activities:',
			error.response?.data || error.message
		);
		res.status(500).send('Failed to retrieve activities.');
	}
});

// Route to return strava data if it is being stored. Not used anywhere, but may get implemented in the future
router.get('/token', (req, res) => {
    if (!stravaData) {
        return res.status(404).send("Token not found.")
    } else {
        res.status(200).json(stravaData)
    }
})

module.exports = router
