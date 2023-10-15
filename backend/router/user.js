const express = require('express');
require("../db/connection");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const router = express.Router()


function authenticateUser(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      req.userId = decoded.userId;
      next();
    });
  }

router.post("/register",async (req,res)=>{
    try{
        const { username, email, password } = req.body;

        // Check if the email is already in use
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }
    
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user document
        const newUser = new User({
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
    
        res.status(201).json({ message: 'User registered successfully', token });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: 'Registration failed' });
    }
})

router.post("/login",async (req,res)=>{
    try{
        const { email, password } = req.body;

        // Check if the user with the provided email exists
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
    
        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
    
        // If the password is correct, generate a new JWT token
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
          expiresIn: '1h', // Set token expiration time
        });
    
        res.status(200).json({ message: 'Authentication successful', token });
    }catch(err){
        console.error(error);
    res.status(500).json({ message: 'Registration failed' });

    }
})

router.put('/profile', authenticateUser, async (req, res) => {
    try {
      const { username, profilePicture } = req.body;
      const userId = req.userId;
  
      // Find the user by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user's profile information
      user.username = username || user.username;
      user.profilePicture = profilePicture || user.profilePicture;
  
      // Save the updated user profile
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Profile update failed' });
    }
  });

module.exports=router