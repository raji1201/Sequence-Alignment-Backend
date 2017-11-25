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
  	history: [{query: String, database: String, alignment: String, date: Date, score: Number, userScore: Number}],
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
      	}
      	bcrypt.compare(password, user.password, function (err, result) {
        	if (result === true) {
        		return callback(null, user);
        	} else {
          		return callback();
        	}
      	});
  	});
}

//hashing a password before saving it to the database
User.pre('save', function (next) {
  	var user = this;
  	bcrypt.hash(user.password, 10, function (err, hash) {
    	if (err) {
      		return next(err);
    	}
    	user.password = hash;
    	next();
  	});
  	bcrypt.hash(user.verifyPassword, 10, function (err, hash) {
    	if (err) {
      		return next(err);
    	}
    	user.verifyPassword = hash;
    	next();
  	});
});

var User = mongoose.model('User', User);  
module.exports = User;
mongoose.connect('mongodb://localhost/'); 