var mongoose = require('mongoose');  
var LeaderBoard = new mongoose.Schema({
	fullName: String,
	score: Number
});

mongoose.model('LeaderBoard', LeaderBoard);  
mongoose.connect('mongodb://localhost/'); 