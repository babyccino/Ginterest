const sinon = require('sinon'),
			Mongoose = require('mongoose'),
			expect = require('chai').expect;

const User = require('./../models/user'),
			Post = require('./../models/post'),
			testData = require('./../util/testdata'),
			compare = require('./../util/compare');

describe('models', () => {
	before(done => {
    Mongoose.connect('mongodb://localhost/testDatabase');
    const db = Mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to test database!');
      testData.init(done);
    });
	});

	after(done => {
    Mongoose.connection.db.dropDatabase(function(){
      Mongoose.connection.close(done);
    });
	});

	describe('test data and functions', () => {
		describe('compare functions', () => {

			it('user should be equal to self', () => {
				compare(testData.user1, testData.user1, testData.userSelect);
			});

			it('user should not be equal to other user', () => {
				compare(testData.user1, testData.user2, testData.userNotSelect);
			});

			it('user array should be equal itself', () => {
				compare(testData.allUsers, testData.allUsers, testData.userSelect);
			});

			it('post should be equal to self', () => {
				compare(testData.allPosts[0], testData.allPosts[0], testData.postSelect);
			});

			it('post should not be equal to other post', () => {
				compare(testData.allPosts[0], testData.allPosts[3], testData.postNotSelect);
			});

			it('post array should be equal itself', () => {
				compare(testData.allPosts, testData.allPosts, testData.postSelect);
			});

		});
	});

	describe('post', () => {
		before(done => {
			done();
		});

		after(done => {
			done();
		});

		describe('validation', () => {
			describe('empty post', () => {
				let post,
						err;

				before(done => {
					post = new Post();
					post.validate(error => {
						err = error;
						done();
					})
				});

				it('should be invalid if userId is empty', () => {
					expect(err.errors.userId).to.exist;
				});

				it('should be invalid if title is empty', () => {
					expect(err.errors.title).to.exist;
				});
				
				it('should be valid if body is empty', () => {
					expect(err.errors.body).to.not.exist;
				});
				
				it('should be invalid if url is empty', () => {
					expect(err.errors.url).to.exist;
				});
			})

		});

		describe('methods', () => {
			describe('instance', () => {
				it('toJSON should give append twitter data to to Post', done => {
					let post = testData.allPosts[0];
					Post.findById(post._id).exec().then(async res => {
						res.toJSON().then(res => {
							compare(post, res, testData.postJSONSelect);
							done();
						}).catch(done);
					}).catch(done);
				});
			});

			describe('statics', () => {
				it('all static should give all posts', done => {
					Post.all().then(res => {
						compare(res, testData.allPosts, testData.postSelect);
						done();
					}).catch(done);
				});

				it('allJSON static should give all posts with twitter info', done => {
					Post.allJSON().then(res => {
						compare(res, testData.allPosts, testData.postJSONSelect);
						done();
					}).catch(done);
				});
			});

			describe('query', () => {
				
			});

		});

	});

	describe('user', () => {
		describe('validation', () => {
			describe('empty user', () => {
				let user,
						err;

				before(done => {
					user = new User();
					user.twitter = null;
					user.validate(error => {
						err = error;
						done();
					})
				});

				it('should be invalid if id is empty', () => {
					expect(err.errors['twitter.id']).to.exist;
				});

				it('should be invalid if token is empty', () => {
					expect(err.errors['twitter.token']).to.exist;
				});
				
				it('should be valid if displayName is empty', () => {
					expect(err.errors['twitter.displayName']).to.exist;
				});
				
				it('should be invalid if username is empty', () => {
					expect(err.errors['twitter.username']).to.exist;
				});
				
				it('should be invalid if displayUrl is empty', () => {
					expect(err.errors['twitter.displayUrl']).to.exist;
				});
			})

		});

	});

});
