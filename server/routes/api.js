// Dependencies
const Express       	= require('express'),
			Passport      	= require('passport'),
			Session       	= require('express-session'),
			CookieSession   = require('cookie-session'),
			TwitterStrategy	= require('passport-twitter');

// Models
const User = require('./../models/user'),
			Post = require('./../models/post');

// Config
const AuthConfig 	= require('./../config/auth');

const router = Express.Router();

const urlRegex = new RegExp(
	/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
);
String.prototype.isURL = function() {
	return (this.match(urlRegex)).length > 0;
}

Passport.use('twitter', new TwitterStrategy(AuthConfig.twitter,
	(token, tokenSecret, profile, done) => {
		process.nextTick(function() {
			User.findOne({'twitter.id': profile.id}, (err, user) => {
				if (err)
					return done(err);

				if (user) {
					return done(null, user);
				} else {
					let newUser = new User({
						twitter: {
							id: profile.id,
							token: token,
							username: profile.username,
							displayName: profile.displayName,
							displayUrl: profile.photos[0].value
						}
					});

					newUser.save((err, user) => {
						if (err) throw err;
						else return done(null, user);
					});
				}
			});
		});
	}
));

router.use(CookieSession({
	maxAge: 24*60*60*1000,
	keys: [AuthConfig.secret]
}));
router.use(Passport.initialize());
router.use(Passport.session());
router.use(function (err, req, res, next) {
	sendError(err, res);
});

function sendError(err, res) {
	let message = typeof(err) == 'object' ? err.message: err;
	console.log("error: ", message);
	if (err.stack)
		console.log("error stack: ", message);
	return res.status(500).send(err);
}

Passport.serializeUser((user, done) => {
	console.log('serialising user...');
	done(null, user.id);
});

Passport.deserializeUser((id, done) => {
	console.log('deserialising user...');
	User.findById(id, (err, user) => {
		console.log('user found');
		done(err, user);
	});
});

function isLoggedIn(req, res, next) {
	console.log('checking authentication...');
	if (req.isAuthenticated()){
		console.log('is authenticated');
		return next();
	} else {
		throw "not authenticated";
	}
}

function newPost(res, post, user) {
		User.findById(user._id, (err, foundUser) => {
			if (err) return sendError("user not found", res);
	
			if (foundUser) {
				let newPost					= new Post();
						newPost.userId	= foundUser._id;
						newPost.title 	= post.title;
						newPost.url 		= post.url;
						newPost.body 		= post.body;
	
				newPost.save((err, savedPost) => {
					if (err) return sendError(err, res);

					savedPost.twitter = {
						username: foundUser.twitter.username,
						displayUrl: foundUser.twitter.displayUrl
					};
					return res.json(savedPost);
				});
			} else
				return sendError("user not found", res);
		});
}

router.get('/auth/twitter', Passport.authenticate('twitter'));
router.get('/auth/twitter/callback',
	Passport.authenticate('twitter', { failureRedirect: '/' }),
	(req, res) => {
		console.log('req.user', req.user);
		console.log('req.session', req.session);
		res.redirect('/');
	}
);

router.get('/logout', (req, res) => {
	console.log('logging out');
	req.logout();
	res.redirect('/');
});

router.get('/posts', (req, res) => {
	Post.find({})
		.sort('-createdAt')
		.exec((err, posts) => {
			if (err) return sendError(err, res);

			res.json(posts);
	});
});

router.get('/posts/by', (req, res) => {
	if (req.query._id) {
		// console.log('req.query.id: ', req.query._id);
		Post.find({'userId': req.query._id})
		.sort('-createdAt')
		.exec((err, posts) => {
			if (err) return sendError("user not found", res);
	
			res.json(posts);
		});
	} else if (req.query.username) {
		// console.log('req.query.username: ', req.query.username);
		User.findOne({'twitter.username': req.query.username})
			.select('_id')
			.exec((err, user) => {
				if (err) return sendError("user not found", res);
				// console.log('user: ', user);
				if (user) {
					Post.find({'userId': user._id})
						.sort('-createdAt')
						.exec((err, posts) => {
							if (err) return sendError("user not found", res);
					
							res.json(posts);
					});
				} else return sendError("user not found", res);
		});
	} else {
		throw "/profile query was illformed";
	}
});

router.post('/post/new', isLoggedIn, (req, res) => {
	let post = req.body,
			user = req.user;
	console.log('POST /api/post');
	if (!post.title && post.title != "") {
		// console.log('Post: ', post);
		throw "Bad post title";
	} else if (!post.url && post.url != "" && post.url.isURL()) {
		// console.log('Post: ', post);
		throw "Bad post URL";
	} else if (!user && user._id != post.userId) {
		// console.log('User: ', user);
		throw "Bad session user data";
	} else {
		newPost(res, post, user);
	}
});

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
