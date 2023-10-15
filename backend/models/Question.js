const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Question type (input, Yes/No, slider, etc.)
  text: { type: String, required: true }, // The text of the question
  // Add more fields for options, validation, etc. depending on question type
});

const questionnaireSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema], // Array of questions
  // Add more fields like description, creator (admin), etc.
});

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);

module.exports = Questionnaire;