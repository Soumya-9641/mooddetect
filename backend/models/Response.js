const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  questionnaire: { type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaire', required: true }, // Reference to the Questionnaire model
  answers: [
    {
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, // Reference to the Question model
      answer: String,
    },
  ],
  score: { type: Number, default: 0 }, // Add a field for storing the user's score
  // Add more fields like timestamp, recommendations, etc. as needed
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;