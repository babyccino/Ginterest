const Sinon = require('sinon'),
			Mongoose = require('mongoose'),
			expect = require('chai').expect;

const User = require('./../models/user'),
			Post = require('./../models/post'),
			Get = require('./../routes/get'),
			testData = require('./../util/testdata'),
			compare = require('./../util/compare');

describe('routes', () => {
	let res;
	before(done => {
    Mongoose.connect('mongodb://localhost/testDatabase');
    const db = Mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', function() {
      console.log('We are connected to test database!');
      testData.init(done);
    });
    res = {
    	json: Sinon.stub(),
    	send: Sinon.stub(),
    	status: Sinon.stub()
    }
	});

	after(done => {
    Mongoose.connection.db.dropDatabase(function(){
      Mongoose.connection.close(done);
    });
	});

	describe('get', () => {
		describe('posts', done => {
			it('empty query should send all posts as JSON', done => {
				req = {
					query: {}
				}
				Get.posts(req, res).then(() => {
					compare(res.json.lastCall.args[0], testData.allPosts, testData.postSelect);
					done();
				}).catch(done);
			});

			it('username query should send posts by user with that username', done => {
				req = {
					query: {
						username:testData.user1.twitter.username
					}
				}
				Get.posts(req, res).then(() => {
					compare(res.json.lastCall.args[0], testData.postsByUser1, testData.postSelect);
					done();
				}).catch(done);
			});

			it('id query should send posts by user with that id', done => {
				req = {
					query: {
						id:testData.user1.id
					}
				}
				Get.posts(req, res).then(() => {
					console.log
					compare(res.json.lastCall.args[0], testData.postsByUser1, testData.postSelect);
					done();
				}).catch(done);
			});
		});
	});

	describe('post', () => {
		describe('new post', done => {
			it('valid post sends', done => {
				req = {
					query: {}
				};
				done();
			});

		});

		after(done => {
			testData.reInit(done);
		})

	});

});
