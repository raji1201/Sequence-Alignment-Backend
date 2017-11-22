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

		if (person.fullName && person.email && person.password && person.verifyPassword) {
			
			if (person.password !== person.verifyPassword) {
				res.status(204);
				res.end();
			}

			var userData = { 
				fullName: person.fullName, 
				password: person.password, 
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
		}
	},

	login: function (req, res) {
		var person = req.body;
		console.log(req.body);
		User.
			findOne().
			where('email').equals(person.email).
			select('fullName email').
			exec(function (err, person) {
				if (err) {
					res.status(504);
					res.end(err);
				}
				else {
					console.log(person);
					res.end(JSON.stringify(person.fullName));
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
	LeaderBoard.find({}, function (err, docs) {
		if (err) {
			res.status(504);
			res.end(err);
		} else {
			for (let i = 0; i < docs.length; i++) {
				console.log(`user: ${docs[i].fullName} score: ${docs[i].score}`);
			}
			res.end(JSON.stringify(docs));
		}
	});	
	},

	addToLeaderBoard: function (req, res, next) {
		var score = req.body;
		console.log(score);
		
		new LeaderBoard({ 
			fullName: score.fullName, 
			score: score.score})
			.save(function (err) {
			if (err) {
				res.status(504);
				res.end(err);
			} else {
				console.log('Score saved');
				res.end();
			}
		});
	}
}