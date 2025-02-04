// Import dependencies
const express = require('express');
const app = express();
const stravaRouter = require('./routes/strava');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware for parsing form data and JSOn
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware for logging all incoming requests
app.use(logger);

// Set the view engine to EJS for rendering HTML templates
app.set('view engine', 'ejs');

// Load environment variables from .env file
require('dotenv').config();

// Redirect the default url to the /strava route for convenience
app.get('/', (req, res) => {
	res.redirect('/strava')
})

// Use the Strava router for handling all /strava routes
app.use('/strava', stravaRouter);

// Logging middleware to display requested URLs in the console
function logger(req, res, next) {
	console.log(req.originalUrl);
	next();
}

// Set app to listen on port 8080
app.listen(8080);
