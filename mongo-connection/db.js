var mongoose = require('mongoose');  
var User = new mongoose.Schema({
	fullName: String,
	password: String,
  	email: String
});

mongoose.model('User', User);  
mongoose.connect('mongodb://localhost/'); 

console.log('we are connected');