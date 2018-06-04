const Passport      	= require('passport'),
			Session       	= require('express-session'),
			TwitterStrategy	= require('passport-twitter');

const User = require('./../models/user');

const AuthConfig 	= require('./../config/auth');

Passport.use('twitter', new TwitterStrategy(AuthConfig.twitter, twitterStrategyCallback));
Passport.serializeUser((user, done) => {
	console.log('serialising user...');
	return done(null, user.id);
});
Passport.deserializeUser((id, done) => {
	console.log('deserialising user...');
	const user = User.findById(id, (err, user) => {
		console.log('user found');
		done(err, user);
	});
});

function twitterStrategyCallback(token, tokenSecret, profile, done) {
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

Passport.isLoggedIn = (req, res, next) => {
	console.log('checking authentication...');
	if (req.isAuthenticated()){
		console.log('is authenticated');
		return next();
	} else {
		throw "not authenticated";
	}
}

module.exports = Passport;
