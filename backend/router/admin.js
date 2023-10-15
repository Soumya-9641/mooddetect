const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/adminAuthorization');
const Questionnaire = require('../models/Question');
const Admin= require("../models/Admin")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post("/adminreg",async (req,res)=>{
  try{
    const { username, email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', {
      expiresIn: '1h', // Set token expiration time
    });

    res.status(201).json({ message: 'Admin registered successfully', token });
  }catch(err){
    res.status(500).json({ message: 'Admin not created' });
  }
})

router.post('/questionnaires', isAdmin, async (req, res) => {
    try {
      const { title, questions } = req.body;
  
      // Create a new questionnaire document
      const newQuestionnaire = new Questionnaire({
        title,
        questions,
      });
  
      // Save the questionnaire to the database
      await newQuestionnaire.save();
  
      res.status(201).json({ message: 'Questionnaire created successfully', questionnaire: newQuestionnaire });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Questionnaire creation failed' });
    }
  });



  // Update an existing questionnaire
router.put('/questionnaires/:id', isAdmin, async (req, res) => {
    try {
      const { title, questions } = req.body;
      const questionnaireId = req.params.id;
  
      // Find the questionnaire by its ID
      const questionnaire = await Questionnaire.findById(questionnaireId);
  
      if (!questionnaire) {
        return res.status(404).json({ message: 'Questionnaire not found' });
      }
  
      // Update questionnaire fields
      questionnaire.title = title || questionnaire.title;
      questionnaire.questions = questions || questionnaire.questions;
  
      // Save the updated questionnaire
      await questionnaire.save();
  
      res.status(200).json({ message: 'Questionnaire updated successfully', questionnaire });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Questionnaire update failed' });
    }
  });


  // Delete a questionnaire
router.delete('/questionnaires/:id', isAdmin, async (req, res) => {
    try {
      const questionnaireId = req.params.id;
  
      // Find the questionnaire by its ID and remove it
      await Questionnaire.findByIdAndRemove(questionnaireId);
  
      res.status(200).json({ message: 'Questionnaire deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Questionnaire deletion failed' });
    }
  });


  module.exports=router;