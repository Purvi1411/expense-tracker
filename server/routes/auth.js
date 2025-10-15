// server/routes/auth.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 

// 🛑 CONSOLIDATED USER MODEL 🛑
// This code is kept here to avoid file resolution issues.

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Pre-save hook: Hash the password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        // Log error and pass it up the chain if hashing fails
        console.error("Bcrypt Hashing Failed:", error);
        next(error); 
    }
});

const User = mongoose.model('User', UserSchema); 
// -------------------------------------------------------------

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route POST /api/auth/register
// @desc Register a new user
// @access Public
router.post('/register', async (req, res) => {
    // 🛑 FIX: Use safe destructuring (req.body || {}) to prevent the crash if req.body is undefined.
    const { email, password } = req.body || {}; 

    // Manual check for missing fields (triggers if body was empty)
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password." });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Mongoose will trigger the pre-save hook here
        user = await User.create({ email, password }); 

        res.status(201).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        // Log the specific Mongoose error for debugging
        console.error("Registration failed with Mongoose error:", error.message);
        
        // Return a generic 500 error to the client
        res.status(500).json({ message: 'Something went wrong on the server.' });
    }
});

// @route POST /api/auth/login
// @desc Authenticate user & get token
// @access Public
router.post('/login', async (req, res) => {
    // 🛑 FIX: Safe Destructuring for Login as well
    const { email, password } = req.body || {};
    
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password." });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error("Login internal server error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;