const express = require('express');
const app = express();
const stravaRouter = require('./routes/strava');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);
app.set('view engine', 'ejs');
require('dotenv').config();

// Redirect the default url to the /strava route
app.get('/', (req, res) => {
	res.redirect('/strava')
})

// Tell app to use the strava route
app.use('/strava', stravaRouter);

// logging function for testing purposes
function logger(req, res, next) {
	console.log(req.originalUrl);
	next();
}

// Set app to listen on port 8080
app.listen(8080);
