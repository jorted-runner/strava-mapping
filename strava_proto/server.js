const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);
app.set('view engine', 'ejs');



function logger(req, res, next) {
	console.log(req.originalUrl);
	next();
}

app.listen(8080);
