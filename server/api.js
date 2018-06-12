// Dependencies
const Express       	= require('express')
			CookieSession   = require('cookie-session'),
			SerializeError 	= require('serialize-error');

// Models
const Get = require('./routes/get'),
			Post = require('./routes/post'),
			Delete = require('./routes/delete'),
			Auth = require('./routes/auth'),
			sendError = require('./util/sendError');

// Config
const AuthConfig 	= require('./config/auth');

const router = Express.Router();

router.use(CookieSession({
	maxAge: 24*60*60*1000,
	keys: [AuthConfig.secret]
}));
router.use(Auth.initialize());
router.use(Auth.session());
router.use((err, req, res, next) => {
	sendError(err, res);
	next(err);
});

router.get('/auth/twitter', Auth.authenticate('twitter'));
router.get('/auth/twitter/callback',
	Auth.authenticate('twitter',
		{ failureRedirect: '/' }),
		(req, res) => {
			// console.log('req.user', req.user);
			// console.log('req.session', req.session);
			return res.redirect('/');
		}
);
router.get('/logout', (req, res) => {
	console.log('logging out');
	req.logout();
	return res.redirect('/');
});
router.get('/posts', Get.posts);
router.get('/user', (req, res) => {
	return res.json(req.user ? req.user : false);
});

router.post('/posts', Auth.isLoggedIn, Post.newPost);

router.delete('/posts', Auth.isLoggedIn, Delete.post);

module.exports = router;
