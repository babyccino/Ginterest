const Sinon = require('sinon'),
			Mongoose = require('mongoose'),
			expect = require('chai').expect;

const User = require('./../models/user'),
			Post = require('./../models/post'),
			Get = require('./../routes/get'),
			PostRequest = require('./../routes/post'),
			Delete = require('./../routes/delete'),
			testData = require('./../util/testdata'),
			sendError = require('./../util/sendError'),
			isUrl = require('./../util/isUrl'),
			compare = require('./../util/compare');

describe('routes', () => {
	let res;
	before(done => {
		Mongoose.connect('mongodb://localhost/testDatabase');
    const db = Mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      testData.init(done);
    });
    res = {
    	json: Sinon.stub().returnsThis(),
    	send: Sinon.stub().returnsThis(),
    	status: Sinon.stub().returnsThis()
    };
	});

	after(done => {
    Mongoose.connection.db.dropDatabase(function(){
      Mongoose.connection.close(done);
    });
	});

	describe('util', () => {
		describe('isUrl', () => {
			it('valid urls return true', done => {
				[
					"adobe.com/go/flex",
					"gskinner.com/products/spl",
					"http://RegExr.com?2rjl6",
					"https://google.com",
					"https:google.com",
					"www.cool.com.au",
					"http://www.cool.com.au",
					"http://www.cool.com.au/ersdfs",
					"http://www.cool.com.au/ersdfs?dfd=dfgd@s=1",
					"http://www.cool.com:81/index.html"
				].map(el => {
					expect(isUrl(el)).to.be.true;
				});
				done();
			});

			it('invalid urls return false', done => {
				[
					"htps://google.com",
					"https:/google.com",
					"http://localhost",
					"http://localhost:3000"
				].map(el => {
					expect(isUrl(el)).to.not.be.true;
				});
				done();
			});

		});

	});

	describe('get', () => {
		describe('posts', done => {
			it('empty query should send all posts as JSON', done => {
				let req = {
							query: {}
						}
				Get.posts(req, res)
					.then(() => {
						compare(res.json.lastCall.args[0], testData.allPosts, testData.postSelect);
						expect(res.status.lastCall.args[0]).to.eql(200);
						done();
					})
					.catch(done);
			});

			it('username query should status 404 when user does not exist', done => {
				let req = {
							query: {
								username: testData.invalidUserId
							}
						}
				Get.posts(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(404);
						done();
					})
					.catch(done);
			});

			it('username query should send posts by user with that username', done => {
				let req = {
							query: {
								username: testData.user1.twitter.username
							}
						}
				Get.posts(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(200);
						compare(res.json.lastCall.args[0], testData.postsByUser1, testData.postSelect);
						done();
					})
					.catch(done);
			});

			it('id query to non existant user should 404', done => {
				let req = {
							query: {
								username: testData.invalidUsername
							}
						}
				Get.posts(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(404);
						done();
					})
					.catch(done);
			});

			it('id query should send posts by user with that id', done => {
				let req = {
							query: {
								id: testData.user1.id
							}
						}
				Get.posts(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(200);
						compare(res.json.lastCall.args[0], testData.postsByUser1, testData.postSelect);
						done();
					})
					.catch(done);
			});
		});
	});

	describe('post', () => {
		describe('new post', done => {
			it('empty post 400s', done => {
				let req = {
							body: {},
							user: {}
						};
				PostRequest.newPost(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(400);
						expect(res.send.lastCall.args[0]).to
							.eql({message: "Bad post title", status: 400});
						done();
					})
					.catch(done);
			});

			it('post with empty title 400s', done => {
				let req = {
							body: {
								title: ""
							},
							user: {}
						};
				PostRequest.newPost(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(400);
						expect(res.send.lastCall.args[0]).to
							.eql({message: "Bad post title", status: 400});
						done();
					})
					.catch(done);
			});

			it('post without url 400s', done => {
				let req = {
							body: {
								title: "hey"
							},
							user: {}
						};
				PostRequest.newPost(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(400);
						expect(res.send.lastCall.args[0]).to
							.eql({message: "Bad post URI", status: 400});
						done();
					})
					.catch(done);
			});

			it('post with empty url 400s', done => {
				let req = {
							body: {
								title: "hey",
								url: ""
							},
							user: {}
						};
				PostRequest.newPost(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(400);
						expect(res.send.lastCall.args[0]).to
							.eql({message: "Bad post URI", status: 400});
						done();
					})
					.catch(done);
			});

			it('post with bad url 400s', done => {
				let req = {
							body: {
								title: "hey",
								url: "http://localhost:3000"
							},
							user: {}
						};
				PostRequest.newPost(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(400);
						expect(res.send.lastCall.args[0]).to
							.eql({message: "Post image URL not URL", status: 400});
						done();
					})
					.catch(done);
			});

			it('post userid different to user\'s id 400s', done => {
				let req = {
							body: {
								title: "hey",
								url: "google.com",
								userId: testData.user1._id
							},
							user: {
								_id: testData.user2._id
							}
						};
				PostRequest.newPost(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(400);
						expect(res.send.lastCall.args[0]).to
							.eql({message: "Bad session user data", status: 400});
						done();
					})
					.catch(done);
			});

			it('non existant user 400s', done => {
				let req = {
							body: {
								title: "hey",
								url: "google.com",
								userId: testData.invalidUserId
							},
							user: {
								_id: testData.invalidUserId
							}
						};
				PostRequest.newPost(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(404);
						expect(res.send.lastCall.args[0]).to
							.eql({message: "user not found", status: 404});
						done();
					})
					.catch(done);
			});

			it('valid post is saved and sent to user', done => {
				let req = {
							body: testData.testNewPost,
							user: {
								_id: testData.testNewPost.userId
							}
						};
				PostRequest.newPost(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(200);
						compare(res.json.lastCall.args[0], testData.testNewPost, testData.postJSONSelect);
						Post.all()
							.then(result => {
								expect(result.length).to.eql(testData.allPosts.length + 1);
								done();
							})
							.catch(done);;
					})
					.catch(done);
			});

		});

		after(done => {
			testData.reInit(done);
		})

	});

	describe('delete', () => {
		describe('delete post', () => {
			afterEach(done => {
				testData.reInit(done);
			});

			it('valid id removes post', done => {
				let samplePostId = testData.allPosts[0].id,
						req = {
							query: {
								id: samplePostId
							}
						}

				Delete.post(req, res).then(() => {
					expect(res.json.lastCall.args[0]).to.be.true;
					expect(res.status.lastCall.args[0]).to.eql(200);
					Promise.all([
						Post.findById(samplePostId).exec(),
						Post.all()
					])
						.then(result => {
							expect(result[0]).to.eql(null);
							expect(result[1].length).to.eql(testData.allPosts.length - 1);
							done();
						})
						.catch(done);
				}).catch(done);
			});

			it('valid id does not post', done => {
				let samplePostId = testData.invalidPostId,
						req = {
							query: {
								id: samplePostId
							}
						}

				Delete.post(req, res)
					.then(() => {
						expect(res.json.lastCall.args[0]).to.not.be.true;
						done();
					})
					.catch(done);
			});

			it('invalid request throws', done => {
				let req = {
							query: {}
						}

				Delete.post(req, res)
					.then(() => {
						expect(res.status.lastCall.args[0]).to.eql(400);
						done();
					})
					.catch(done);
			});

		});

	});

});
