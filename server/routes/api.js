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
	return this.match(urlRegex) != "";
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

					newUser.save((err2, user2) => {
						if (err2) throw err2;
						else return done(null, user2);
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

// Error handling
function sendError(err, res) {
	let message = typeof(err) == 'object' ? err.message: err;
	console.log("error: ", message);
	return res.status(500).send(err);
}

router.get('/user', isLoggedIn, function (req, res) {
	if (req.user)
		res.json(req.user);
	else
		sendError("Not logged in", res);
});

router.get('/posts', (req, res) => {
	Post.find({}).exec((err, posts) => {
		if(err) return sendError(err, res);

		res.json(posts);
	});
});

function isLoggedIn(req, res, next) {
	console.log('checking authentication...');
	if (req.isAuthenticated()){
		console.log('is authenticated');
		return next();
	} else {
		console.log('not authenticated');
		return sendError('Not authenticated', res);
	}
}

router.post('/post', isLoggedIn, (req, res) => {
	let post = req.body,
			user = req.user;
	console.log('POST /api/post');
	if (!post.title && post.title != "") {
		sendError("Bad post title", res);
		console.log('Post: ', post);
	} else if (!post.url && post.url != "" && post.url.isURL()) {
		sendError("Bad post URL", res);
		console.log('Post: ', post);
	} else if (!user) {
		sendError("Bad session user data", res);
		console.log('User: ', user);
	} else {
		let newPost			= new Post();
		newPost.userId	= user._id;
		newPost.title 	= post.title;
		newPost.url 		= post.url;
		if (!post.body && post.body != "")	
			newPost.body = post.body;

		newPost.save((err, post) => {
			if (err) 	return sendError(err, res);
			else {
				User.findById(post.userId, (err, user) => {
					if (err) 	return sendError(err, res);

					if (user) {
						post.twitter = {
							username: user.twitter.username,
							displayUrl: user.twitter.displayUrl
						};
						return res.json(post);
					} else {
						console.log('user :', user);
						return sendError("User not found", res)
					}
				});
			}
		});
	}
});

module.exports = router;
