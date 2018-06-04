// Get dependencies
const Express = require('express'),
			Path = require('path'),
			Http = require('http'),
			BodyParser = require('body-parser'),
			Cors = require('cors'),
			Mongoose = require('mongoose'),
			Fs = require('fs'),
			DbConfig = require('./server/config/database.js');

Mongoose.connect(DbConfig.database);

// API file for interacting with MongoDB
const index = require('./server/index'),
			api = require('./server/api');

const app = Express();

app.use(function (err, req, res, next) {
	console.error(err.stack)
	res.status(500).send('Something broke!')
});

// Parsers for POST data
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(Express.static(Path.join(__dirname, 'dist/gintrest')));

app.use('/', index);
app.use('/api', api);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = Http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
