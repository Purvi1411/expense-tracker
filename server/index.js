const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // 1. Import the 'path' module
require('dotenv').config();

// Create the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// --- 2. API Routes (using a more reliable path method) ---
const routesPath = path.join(__dirname, 'routes'); // Defines the absolute path to the 'routes' folder

app.use('/api/auth', require(path.join(routesPath, 'auth')));
app.use('/api/transactions', require(path.join(routesPath, 'transactions')));
app.use('/api/budgets', require(path.join(routesPath, 'budgets')));
app.use('/api/reports', require(path.join(routesPath, 'reports')));

// Start the Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});