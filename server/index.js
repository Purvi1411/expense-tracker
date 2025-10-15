// server/index.js
const app = require('./app'); 
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');


const PORT = process.env.PORT || 8080;

// --- Middleware ---
// Allows the frontend to talk to the backend
app.use(express.json());
// Allows Express to parse JSON bodies from incoming requests
app.use(cors());

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        // Exit process on failure
        process.exit(1); 
    });

// --- Routes ---
// Public routes (Login, Register)
app.use('/api/auth', authRoutes);
// Protected routes (Transactions CRUD)
app.use('/api/transactions', transactionRoutes);

// Simple root route test
app.get('/', (req, res) => res.send('API is running and connected!'));


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));