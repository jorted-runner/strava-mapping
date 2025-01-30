const express = require('express');
const app = express();
const stravaRouter = require('./routes/strava');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);
app.set('view engine', 'ejs');

app.use('/strava', stravaRouter);

function logger(req, res, next) {
	console.log(req.originalUrl);
	next();
}

app.listen(8080);
