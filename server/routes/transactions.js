// server/routes/transactions.js

const express = require('express');
const router = express.Router();
const path = require('path');
const Transaction = require(path.join(__dirname, '..', 'models', 'Transaction.js')); 
const protect = require(path.join(__dirname, '..', 'middleware', 'authMiddleware.js'));
// Apply the middleware to ALL routes in this file to ensure authentication
router.use(protect);

// @route GET /api/transactions
// @desc Get all transactions for the authenticated user (READ)
// @access Private
// @route   GET /api/transactions
// @desc    Get all transactions for a user with optional filtering
// @access  Private
router.get('/', async (req, res) => {
    try {
        // 1. Base query for security
        const query = { userId: req.user.id };

        // 2. Destructure all possible filters from req.query
        const { search, type, category, startDate, endDate } = req.query;

        // Add text search filter
        if (search) {
            query.description = { $regex: search, $options: 'i' };
        }

        // Add type filter
        if (type && type !== 'all') {
            query.type = type;
        }

        // Add category filter
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // --- vvv NEW DATE RANGE FILTER LOGIC vvv ---
        if (startDate || endDate) {
            query.date = {}; // Create a date object in our query

            // If a start date is provided, find transactions on or after that date
            if (startDate) {
                // $gte is MongoDB's "greater than or equal to" operator
                query.date.$gte = new Date(startDate);
            }

            // If an end date is provided, find transactions on or before that date
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999); // Set to the very end of the day
                // $lte is MongoDB's "less than or equal to" operator
                query.date.$lte = endOfDay;
            }
        }
        // --- ^^^ END OF NEW LOGIC ^^^ ---

        console.log("Executing query:", query); // Good for debugging

        // 3. Execute the final query
        const transactions = await Transaction.find(query).sort({ date: -1 });
        
        res.json(transactions);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
// @route POST /api/transactions
// @desc Create a new transaction (CREATE)
// @access Private
router.post('/', async (req, res) => {
    try {
        // SECURITY: Attach the userId from the token before saving
        const transaction = await Transaction.create({
            ...req.body,
            userId: req.user.id,
        });
        res.status(201).json(transaction);
    } catch (err) {
        // 400 for validation errors (e.g., missing amount, description)
        res.status(400).json({ message: err.message });
    }
});

// @route PATCH /api/transactions/:id
// @desc Update an existing transaction (UPDATE)
// @access Private
router.patch('/:id', async (req, res) => {
    try {
        // Find the transaction by ID and ensure it belongs to the current user
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, 
            req.body, 
            { new: true, runValidators: true } // Return the updated doc and enforce validation
        );

        if (!updatedTransaction) {
            // Returns 404 if the ID is wrong OR if the transaction belongs to another user
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }
        res.json(updatedTransaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route DELETE /api/transactions/:id
// @desc Delete a transaction (DELETE)
// @access Private
router.delete('/:id', async (req, res) => {
    try {
        // Find and delete the transaction, ensuring it belongs to the current user
        const result = await Transaction.deleteOne({ _id: req.params.id, userId: req.user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        res.json({ message: 'Transaction successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;