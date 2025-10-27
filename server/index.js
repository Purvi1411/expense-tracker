const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // 1. Import the 'path' module
require('dotenv').config();

// Create the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
const allowedOrigins = [
    // The actual URL of your deployed Vercel/Netlify frontend
    'expense-tracker-6u11ils8o-purvi-pals-projects.vercel.app', 
    // Add other allowed origins if needed (e.g., a test environment)
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true); 
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Origin is in the allowed list
        } else {
            // Block the request if the origin is not allowed
            callback(new Error('Not allowed by CORS')); 
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies/headers to be sent
    optionsSuccessStatus: 204
};

// Apply the configured CORS options
app.use(cors(corsOptions));
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