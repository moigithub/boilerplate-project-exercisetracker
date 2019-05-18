import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({
	name: String
});

export default mongoose.model('User', UserSchema);