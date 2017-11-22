var mongoose = require('mongoose');  
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
  	email: {
  		type: String,
  		unique: true,
  		required: true,
  		trim: true	
  	},
  	history: [{query: String, database: String, alignment: String, date: Date, score: Number, userScore: Number, }]
});

mongoose.model('User', User);  
mongoose.connect('mongodb://localhost/'); 

console.log('we are connected');