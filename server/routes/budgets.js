const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const protect = require('../middleware/authMiddleware');

// Protect all routes in this file
router.use(protect);

// @route   GET /api/budgets
// @desc    Get all budgets for the current month for the logged-in user
router.get('/', async (req, res) => {
    try {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();

        const budgets = await Budget.find({ userId: req.user.id, month, year });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/budgets
// @desc    Create or update a budget for a category
router.post('/', async (req, res) => {
    const { category, amount } = req.body;
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    try {
        // Use findOneAndUpdate with 'upsert' to create or update a budget
        const budget = await Budget.findOneAndUpdate(
            { userId: req.user.id, category, month, year },
            { amount },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(201).json(budget);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;