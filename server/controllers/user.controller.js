import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

//sign up function
const signup = async (req, res) => {
  try {
    const { username, email, password, encryptedPrivateKey, publicKey } = req.body;

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
      encryptedPrivateKey,
      publicKey,
    });

    // Generate JWT token
    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // user to send to client
    const user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };

    // Send response with token
    res.status(201).json({ message: 'User created successfully', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '💔 Server error' });
  }
};

// login function
const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find user by email or username
    const user = usernameOrEmail.includes("@")
      ? await User.findOne({ email: usernameOrEmail })
      : await User.findOne({ username: usernameOrEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Send full user data including keys
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        publicKey: user.publicKey,
        encryptedPrivateKey: user.encryptedPrivateKey,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "💔 Server error" });
  }
};

// GET /api/users/me to get the current user's details
export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Get user's profile
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Send user's profile
  res.json(user);

};

// update user's profile
export const updateProfile = async (req, res) => {
  try {
    const { username, profile, password } = req.body;

    if (!username && !profile) {
      return res.status(400).json({ error: "No changes detected" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, profile },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "💔 Server error" });
  }
};

// export the functions
export { signup, login };
