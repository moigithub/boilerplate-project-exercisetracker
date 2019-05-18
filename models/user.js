const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: String
});


const User = mongoose.model('User', UserSchema);
module.exports = User
