const express = require('express');
const router = express.Router();
const path = require('path');
const Transaction = require(path.join(__dirname, '..', 'models', 'Transaction.js')); 
const protect = require(path.join(__dirname, '..', 'middleware', 'authMiddleware.js'));

router.use(protect);

// @route GET /api/transactions
// @desc Get all transactions for the authenticated user with filtering
// @access Private
router.get('/', async (req, res) => {
    try {
        // 1. Initialize the base query object with mandatory user ID
        const query = { userId: req.user.id };

        // 2. Destructure all possible filters from req.query
        const { search, type, category, startDate, endDate, month } = req.query;

        // --- FILTER LOGIC ---
        // Add text search filter
        if (search) {
            query.description = { $regex: search, $options: 'i' };
        }

        // Add type filter
        if (type && type !== 'all') {
            query.type = type;
        }

        // Add category filter (Crucial for the pie chart breakdown)
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // UPDATED DATE LOGIC
        if (month === 'current') {
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            endOfMonth.setHours(23, 59, 59, 999);
            query.date = { $gte: startOfMonth, $lte: endOfMonth };
        } else if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate);
            }
            if (endDate) {
                const endOfDay = new Date(endDate);
                endOfDay.setHours(23, 59, 59, 999);
                query.date.$lte = endOfDay;
            }
        }
        // --- END FILTER LOGIC ---

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
        const transaction = await Transaction.create({
            ...req.body,
            userId: req.user.id,
        });
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route PATCH /api/transactions/:id
// @desc Update an existing transaction (UPDATE)
// @access Private
router.patch('/:id', async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
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
        const result = await Transaction.deleteOne({ _id: req.params.id, userId: req.user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Transaction not found or unauthorized' });
        }

        res.json({ message: 'Transaction successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;