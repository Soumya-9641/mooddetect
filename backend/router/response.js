const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/adminAuthorization');
const Response = require('../models/Response'); // Assuming you have a Response model
const Questionnaire= require("../models/Question")
const recommendContent= require("../recomendation")
// Function to calculate a score based on user responses
function calculateScore(questions, userAnswers) {
  let totalScore = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const userAnswer = userAnswers[i];

    // Evaluate the question based on its type
    switch (question.type) {
      case 'YesNo':
        // For Yes/No questions, assign 1 point for 'Yes' and 0 points for 'No'
        if (userAnswer.toLowerCase() === 'yes') {
          totalScore += 1;
        }
        break;

      case 'Slider':
        // For Slider questions, calculate the score based on the position of the slider (e.g., 0-100)
        // You can define a specific formula for scoring sliders
        const sliderPosition = parseFloat(userAnswer);
        // Example: Assign score based on slider position, where higher values get higher scores
        totalScore += sliderPosition;
        break;

      case 'Input':
        // For Input questions, you can define specific rules for scoring based on user answers
        // Example: Assign a score based on the length of the input text
        const inputLength = userAnswer.length;
        // Example: Assign score based on the length, where longer answers get higher scores
        totalScore += inputLength;
        break;

      // Add more cases for other question types (e.g., multiple-choice, open-ended)

      default:
        // Handle unknown question types or assign a default score
        totalScore += 0;
        break;
    }
  }

  return totalScore;
}

// Submit a response to a questionnaire
router.post('/responses', isAuthenticated, async (req, res) => {
  try {
    const { questionnaireId, answers } = req.body;
    const userId = req.userId; // Get the authenticated user's ID

    // Calculate the user's score based on the answers and the questionnaire's questions
    const questionnaire = await Questionnaire.findById(questionnaireId);
    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    const score = calculateScore(questionnaire.questions, answers);

    // Create a new response document
    const newResponse = new Response({
      user: userId,
      questionnaire: questionnaireId,
      answers,
      score,
    });

    // Save the response to the database
    await newResponse.save();

        // Get content recommendations based on the user's score
    const recommendations = recommendContent(score);

    res.status(201).json({ message: 'Response submitted successfully', response: newResponse, score,recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Response submission failed' });
  }
});

// Get user responses to a specific questionnaire
router.get('/responses/:questionnaireId', isAuthenticated, async (req, res) => {
  try {
    const userId = req.userId; // Get the authenticated user's ID
    const questionnaireId = req.params.questionnaireId;

    // Retrieve user responses for the specified questionnaire
    const userResponses = await Response.find({ user: userId, questionnaire: questionnaireId });

    res.status(200).json({ responses: userResponses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch responses' });
  }
});

module.exports = router;