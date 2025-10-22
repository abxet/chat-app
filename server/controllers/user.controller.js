import express from 'express';
import mongoose from 'mongoose';

//sign up function
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check duplicates
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send response with token
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '💔 Server error' });
  }
};


// login function
const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Validate input
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find user by email or username
    let user;
    if (usernameOrEmail.includes('@')) {
      user = await User.findOne({ email: usernameOrEmail });
    } else {
      user = await User.findOne({ username: usernameOrEmail });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send response with token
    res.status(200).json({
      message: 'Login successful',
      token,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '💔 Server error' });
  }
};

// export the functions
export { signup, login };
