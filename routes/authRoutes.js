const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

// Secret key for JWT
const JWT_SECRET = 'your_secret_key_here'; // Change this to a strong secret key

/** 
 * @route   POST /api/auth/register
 * @desc    Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        console.log('📩 Incoming Registration Request:', req.body);

        const { username, password, email } = req.body;

        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log('✅ User registered successfully:', newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('❌ Registration Error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

/** 
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 */
router.post('/login', async (req, res) => {
    try {
        console.log('📩 Incoming Login Request:', req.body);

        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        console.log('✅ User logged in successfully');
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('❌ Login Error:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
