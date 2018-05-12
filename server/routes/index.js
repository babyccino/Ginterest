const Express = require('express');
const Path = require('path');

const router = Express.Router();

router.get('/hi', (req, res, next) => {
	res.sendFile(Path.join(__dirname, '/../../dist/gintrest/index.html'));
});

router.get('/hey', (req, res, next) => {
	console.log('hey');
	res.send('hey');
});

router.get('/fuck', (req, res, next) => {
	console.log('fuck');
	res.send('fuck');
});

module.exports = router;
