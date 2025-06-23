import db from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const User = db.User;

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    return res.status(201).json({ message: 'User created Successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.isValidPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Set cookie with token, secure & httpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      domain: '.vercel.app', // Critical for Vercel deployments
      path: '/',
    });

    return res.json({ message: 'Login successful' , token});
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    path: '/',
  });
  res.json({ message: 'Logged out' });
};