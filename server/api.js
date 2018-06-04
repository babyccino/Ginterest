// Dependencies
const Express       	= require('express')
			CookieSession   = require('cookie-session'),
			SerializeError 	= require('serialize-error');

// Models
const Get = require('./routes/get'),
			Post = require('./routes/post'),
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
router.get('/user', Auth.isLoggedIn, (req, res) => {
	return res.json(req.user);
});

router.post('/post/new', Auth.isLoggedIn, Post.newPost);

/* 
let user = {
			_id: '5b0ab85fcfe0e825a6cc33d0',
			twitter: {
				username : "babyccino1",
				displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3i_normal.jpg"
			}
		},
		posts = [
			{
				title: 'hey',
				url: 'https://i.redditmedia.com/ChqrgxkBSTwiZa1gdFLcUjKMfcvYAOM44bsJsRlfmpM.jpg?s=bf3b393d037b0be06da1a2fd0c42b449',
				body: ''
			},
			{
				title: 'hey',
				url: 'https://i.redditmedia.com/WQ4AluC9HHgYozQmHwZNrQaR3n_AaoV5lvDmN4fOPdI.jpg?s=ba960f89c41920ba94bb783ca5723994',
				body: ''
			},
			{
				title: 'hey',
				url: 'https://i.redditmedia.com/DZLTgVMthlCwcwHaTEN-jMDdnIYtkLDrTYfJUUhDPr0.jpg?s=6e0c541e34bbd4d9f33572db7dc03292',
				body: ''
			},
			{
				title: 'hey',
				url: 'https://i.redditmedia.com/4abSE7z7a4nOkcAF-Bg3lULszeRvs-iwQLdSds8z8vQ.jpg?s=4f5cb498efd885f886477cf0b9bfb006',
				body: ''
			},
			{
				title: 'hey',
				url: 'https://i.redditmedia.com/PFEXhrf2RLwM_84cuoiCSCybS-1F0aRBEWOBSkHgHTI.jpg?s=1aa3113fab975339d36cd86215c9b4fc',
				body: ''
			}
		];
*/

module.exports = router;
