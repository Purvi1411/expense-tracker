// server/app.js

const express = require('express');
const app = express();
// const cors = require('cors');

// // Note: Because we removed the 'path' fix from transactions.js 
// // when we consolidated the model, we must use simple relative requires here.
// // Ensure your app.js can find these files using their relative paths.
// const authRoutes = require('./routes/auth'); 
// const transactionRoutes = require('./routes/transactions');

// // 🛑 Initialize Express app


// // --- CRITICAL MIDDLEWARE ORDER ---

// // 1. MUST BE FIRST: Parse JSON body. This is the only way to reliably fix the crash.
// app.use(express.json()); 

// // 2. Allow cross-origin requests (necessary for client on port 5173 talking to server on 8080)
// app.use(cors()); 

// // --- Routes ---
// // 3. Public routes (Login, Register)
// app.use('/api/auth', authRoutes);
// // 4. Protected routes (Transactions CRUD)
// app.use('/api/transactions', transactionRoutes);

// // Simple root route test
// app.get('/', (req, res) => res.send('API is running and configured!'));

// // --- Error Handler (Optional but helpful to catch unhandled errors) ---
// app.use((err, req, res, next) => {
//     // Log the error to the console for debugging
//     console.error("EXPRESS UNCAUGHT ERROR:", err.stack); 
//     // Send a generic 500 status to the client
//     res.status(500).json({ message: 'Something went wrong on the server.' });
// });


// // Export the configured app instance
module.exports = app;