// Get dependencies
const Express = require('express');
const Path = require('path');
const Http = require('http');
const BodyParser = require('body-parser');

// API file for interacting with MongoDB
const index = require('./server/routes/index');
const api = require('./server/routes/api');

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
