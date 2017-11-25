require('mongoose').model('User');
require('mongoose').model('LeaderBoard');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var LeaderBoard = mongoose.model('LeaderBoard');

/*//Deletes the model in the database every time server is started
User.remove({}, function(err) { 
	 console.log('collection removed') 
});*/

module.exports = {

	createUsers: function (req, res, next) {
		var person = req.body;

		if (person.password !== person.verifyPassword) {
			res.status(204);
			res.end("Passwords do not match!");
		} else if (person.fullName && person.email && person.password && person.verifyPassword) {
			var userData = { 
				fullName: person.fullName, 
				password: person.password,
				verifyPassword: person.verifyPassword, 
				email: person.email 
			}
			User.create (userData, function (err, user) {
				if (err) {
					res.status(504);
					return next(err);
				}
				else {
					res.status(200);
					res.end();  
				}
			});
		} else {
    		var err = new Error('All fields required.');
    		err.status = 400;
    		return next(err);
  		}
	},

	login: function (req, res, next) {
		var person = req.body;
		if (person.email && person.password) {
				User.authenticate(person.email, person.password, function (error, user) {
      				if (error || !user) {
       					var err = new Error('Wrong email or password.');
        				err.status = 401;
        				return next(err);
      				} else {
				        req.session.userId = user._id;
				        res.status(200);
				        res.end(JSON.stringify(user));
      				}
    		});
		} else {
    		var err = new Error('All fields required.');
    		err.status = 400;
    		return next(err);
  		}
	},

	logout: function (req, res, next) {
		if (req.session) {
			req.session.destroy(function (err) {
				if (err) {
					return next(err);
				}
				else {
					res.status(200);
					res.end();
				}
			})
		}
	},

	updateScore: function (userId, userScore) {
		console.log(userId);
		User.findById(userId, function (err, user){
			if (err) {
				console.log(err);
			}
			console.log(user);
			if (userScore > user.highScore) {
				user.highScore = userScore;
				user.save(function (err, updatedUser){
					if (err) {
						console.log(err);
					}
					console.log(updatedUser);
					console.log(`${user.fullName} has a new high score of ${user.highScore}`);
				});
			}
		});
	},

	seeResults: function (req, res, next) {
		User.find({}, function (err, docs) {
			if (err) {
				res.status(504);
				res.end(err);
			} else {
				for (let i = 0; i < docs.length; i++) {
				console.log('user:', docs[i].fullName);
			}
			res.end(JSON.stringify(docs));
			}
		});
	},

	leaderBoard: function (req, res, next) {
		User.find({}, function (err, docs) {
			if (err) {
				res.status(504);
				res.end(err);
			} else {
				docs.sort((a, b) => b.highScore - a.highScore);
				res.end(JSON.stringify(docs.slice(0, 10)));
				console.log(docs);
			}
		});	
	}
}