const mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({
	userId: String,
  description: String,
  duration: Number,
  date: Date
});


const Exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = Exercise