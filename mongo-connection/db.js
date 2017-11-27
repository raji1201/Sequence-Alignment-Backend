var mongoose = require('mongoose');  
var bcrypt = require('bcrypt');

var User = new mongoose.Schema({
	fullName: {
		type: String,
  		required: true,
  		trim: true	
	},
	password: {
		type: String,
  		required: true
	},
	verifyPassword: {
		type: String,
  		required: true
	},
  	email: {
  		type: String,
  		unique: true,
  		required: true,
  		trim: true	
  	},
  	highScore: {
  		type:Number,
  		default: 0
  	},
  	history: [{}],
});

//authenticate input against database
User.statics.authenticate = function (email, password, callback) {
  	User.findOne({ email: email }, function(err, user) {
  		if (err) {
        	return callback(err)
      	} else if (!user) {
        	var err = new Error('User not found.');
		    err.status = 401;
		    return callback(err);
      	} else if (user.password === password) {
      		return callback(null, user);
    	} else {
    		return callback();
    	}
  	});
}


var User = mongoose.model('User', User);  
module.exports = User;
mongoose.connect('mongodb://localhost/'); 

//[{query: String, database: String, queryStart: Number, databaseStart: Number, queryAlignment: String, databaseAlignment: String, date: Date, score: Number, userScore: Number}]